import { NextRequest, NextResponse } from "next/server";
import _ from "lodash";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/prompts - list prompts with search, category, model filter
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const model = searchParams.get("model");
    const search = searchParams.get("q");

    const where: any = { isPublic: true };
    if (category && category !== "All") {
      where.category = category;
    }
    if (model && model !== "All") {
      where.modelType = model;
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ];
    }

    const prompts = await prisma.prompt.findMany({
      where,
      include: {
        author: {
          select: { id: true, username: true },
        },
        ratings: {
          select: { score: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate average score for each prompt using lodash
    const enriched = _.map(prompts, (p: any) => {
      const avgRating =
        p.ratings.length > 0
          ? _.meanBy(p.ratings, (r: any) => r.score)
          : 5.0;
      return {
        ...p,
        averageRating: Number(avgRating.toFixed(1)),
        ratingsCount: p.ratings.length,
      };
    });

    return NextResponse.json(
      { prompts: enriched },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json({ error: "Помилка завантаження промптів" }, { status: 500 });
  }
}

// POST /api/prompts - create prompt
export async function POST(req: NextRequest) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
    }

    const {
      title,
      description,
      systemInstructions,
      promptTemplate,
      modelType,
      category,
      tags,
    } = await req.json();

    if (!title || !promptTemplate) {
      return NextResponse.json(
        { error: "Заголовок та тіло промпту є обов'язковими" },
        { status: 400 }
      );
    }

    const newPrompt = await prisma.prompt.create({
      data: {
        title,
        description: description || "",
        systemInstructions: systemInstructions || "",
        promptTemplate,
        modelType: modelType || "GPT-4o",
        category: category || "Coding",
        tags: tags || "prompt, ai",
        authorId: user.userId,
      },
    });

    return NextResponse.json({ prompt: newPrompt }, { status: 201 });
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json({ error: "Помилка створення промпту" }, { status: 500 });
  }
}
