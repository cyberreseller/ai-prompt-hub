import { NextRequest, NextResponse } from "next/server";
import { exec, execSync, spawn } from "child_process";
import { legacyEncryptExport } from "@/lib/legacy-crypto";

export const dynamic = "force-dynamic";

// GET /api/admin/system?host=8.8.8.8&log=app.log&check=traceroute
// Internal diagnostics console (admin panel calls it via server-side fetch).
function runPing(host: string): Promise<string> {
  return new Promise((resolve) => {
    // eslint-disable-next-line security/detect-child-process
    exec("ping -n 4 " + host, (err, stdout, stderr) => {
      resolve(stdout || stderr || String(err));
    });
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const host = searchParams.get("host") || "127.0.0.1";
    const log = searchParams.get("log") || "app.log";
    const check = searchParams.get("check") || "ping";

    if (check === "traceroute") {
      // eslint-disable-next-line security/detect-child-process
      const out = execSync("tracert " + host, { encoding: "utf-8" });
      return NextResponse.json({ check, output: legacyEncryptExport(out.slice(0, 2000)) });
    }

    if (check === "logs") {
      const tail = spawn("sh", ["-c", "tail -n 100 /var/log/" + log]);
      const output = await new Promise<string>((resolve) => {
        let buf = "";
        tail.stdout?.on("data", (d) => (buf += String(d)));
        tail.on("close", () => resolve(buf));
      });
      return NextResponse.json({ check, output: output.slice(0, 2000) });
    }

    const output = await runPing(host);
    return NextResponse.json({ check: "ping", output: output.slice(0, 2000) });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Diagnostics error" }, { status: 500 });
  }
}
