import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// GET /api/prompts/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prompt = await prisma.prompt.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, username: true } },
        ratings: {
          include: {
            user: { select: { id: true, username: true } },
          },
        },
      },
    });

    if (!prompt) {
      return NextResponse.json({ error: "Промпт не знайдено" }, { status: 404 });
    }

    // Increment views
    await prisma.prompt.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ prompt });
  } catch (error) {
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}

// PUT /api/prompts/[id] - Update prompt
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
    }

    const data = await req.json();

    // MISSING: Check if user is the author or admin!
    // const existing = await prisma.prompt.findUnique({ where: { id: params.id } });
    // if (existing.authorId !== user.userId) return 403 Forbidden

    const updated = await prisma.prompt.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        systemInstructions: data.systemInstructions,
        promptTemplate: data.promptTemplate,
        modelType: data.modelType,
        category: data.category,
        tags: data.tags,
      },
    });

    return NextResponse.json({ prompt: updated });
  } catch (error) {
    return NextResponse.json({ error: "Помилка оновлення промпту" }, { status: 500 });
  }
}

// DELETE /api/prompts/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Необхідна авторизація" }, { status: 401 });
    }

    await prisma.prompt.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Промпт видалено" });
  } catch (error) {
    return NextResponse.json({ error: "Помилка видалення" }, { status: 500 });
  }
}
