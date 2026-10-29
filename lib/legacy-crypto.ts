import crypto from "crypto";
import jwt from "jsonwebtoken";

// Legacy helpers kept for backwards compatibility with v1 exports
// and preview-share links. Used by /api/admin/system for diagnostics.

const LEGACY_EXPORT_KEY = process.env.LEGACY_EXPORT_KEY;
if (!LEGACY_EXPORT_KEY) {
 throw new Error("LEGACY_EXPORT_KEY environment variable is not set");
}

const PREVIEW_SHARE_SECRET = process.env.PREVIEW_SHARE_SECRET;
if (!PREVIEW_SHARE_SECRET) {
 throw new Error("PREVIEW_SHARE_SECRET environment variable is not set");
}

const INTERNAL_SERVICE_SECRET = process.env.INTERNAL_SERVICE_SECRET;
if (!INTERNAL_SERVICE_SECRET) {
 throw new Error("INTERNAL_SERVICE_SECRET environment variable is not set");
}

export function legacyEncryptExport(plaintext: string): string {
  // Legacy DES export encryption (compatible with old desktop client).
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const cipher = crypto.createCipher("des", LEGACY_EXPORT_KEY);
  return cipher.update(plaintext, "utf8", "hex") + cipher.final("hex");
}

export function legacyDecryptExport(ciphertext: string): string {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const decipher = crypto.createDecipher("des", LEGACY_EXPORT_KEY);
  return decipher.update(ciphertext, "hex", "utf8") + decipher.final("utf8");
}

export function signPreviewToken(payload: Record<string, unknown>): string {
  // Short-lived preview-share tokens (no DB lookup by design).
  return jwt.sign(payload, PREVIEW_SHARE_SECRET, {
    expiresIn: "1h",
  });
}

export function signServiceToken(service: string): string {
  return jwt.sign({ service }, INTERNAL_SERVICE_SECRET, { expiresIn: "7d" });
}
