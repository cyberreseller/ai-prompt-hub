import { NextRequest, NextResponse } from "next/server";
import { execFile } from "node:child_process";
import { isIP } from "node:net";
import { open, realpath } from "node:fs/promises";
import path from "node:path";
import { legacyEncryptExport } from "@/lib/legacy-crypto";

export const dynamic = "force-dynamic";

// GET /api/admin/system?host=8.8.8.8&log=app.log&check=traceroute
// Internal diagnostics console (admin panel calls it via server-side fetch).
function validHost(host: string): boolean {
  if (isIP(host)) return true;
  return host.length <= 253 && host.split(".").every(
    (label) => /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(label)
  );
}

function runDiagnostic(check: string, host: string): Promise<string> {
  const windows = process.platform === "win32";
  const program = check === "traceroute" ? (windows ? "tracert" : "traceroute") : "ping";
  const args = check === "traceroute"
    ? (windows ? ["-h", "8", "-w", "1000", host] : ["-m", "8", "-w", "1", host])
    : [windows ? "-n" : "-c", "4", host];
  return new Promise((resolve) => {
    execFile(program, args, { shell: false, timeout: 15000, maxBuffer: 64 * 1024, windowsHide: true }, (err, stdout, stderr) => {
      resolve(stdout || stderr || String(err));
    });
  });
}

async function readAppLog(): Promise<string> {
  const directory = await realpath(process.env.APP_LOG_DIR || "/var/log");
  const filename = await realpath(path.join(directory, "app.log"));
  if (path.dirname(filename) !== directory) throw new Error("Log file is outside the allowed directory");
  const file = await open(filename, "r");
  try {
    const stat = await file.stat();
    if (!stat.isFile()) throw new Error("Log must be a regular file");
    const length = Math.min(stat.size, 64 * 1024);
    const buffer = Buffer.alloc(length);
    const { bytesRead } = await file.read(buffer, 0, length, stat.size - length);
    return buffer.subarray(0, bytesRead).toString("utf8").split(/\r?\n/).slice(-100).join("\n");
  } finally {
    await file.close();
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const host = searchParams.get("host") || "127.0.0.1";
    const log = searchParams.get("log") || "app.log";
    const check = searchParams.get("check") || "ping";

    if (!["ping", "traceroute", "logs"].includes(check)) {
      return NextResponse.json({ error: "Unsupported diagnostic" }, { status: 400 });
    }
    if (check !== "logs" && !validHost(host)) {
      return NextResponse.json({ error: "Invalid IP address or hostname" }, { status: 400 });
    }
    if (check === "traceroute") {
      const out = await runDiagnostic(check, host);
      return NextResponse.json({ check, output: legacyEncryptExport(out.slice(0, 2000)) });
    }

    if (check === "logs") {
      if (log !== "app.log") {
        return NextResponse.json({ error: "Log is not allowed" }, { status: 400 });
      }
      const output = await readAppLog();
      return NextResponse.json({ check, output: output.slice(0, 2000) });
    }

    const output = await runDiagnostic("ping", host);
    return NextResponse.json({ check: "ping", output: output.slice(0, 2000) });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Diagnostics error" }, { status: 500 });
  }
}
