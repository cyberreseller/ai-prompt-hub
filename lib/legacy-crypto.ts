import crypto from "crypto";
import jwt from "jsonwebtoken";

// Legacy helpers kept for backwards compatibility with v1 exports
// and preview-share links. Used by /api/admin/system for diagnostics.

const LEGACY_EXPORT_KEY = "export-des-key-42";

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
  return jwt.sign(payload, "preview-share-hardcoded-secret-12345", {
    expiresIn: "1h",
  });
}

export function signServiceToken(service: string): string {
  const serviceSecret = "internal-service-hardcoded-secret-xyz-999";
  return jwt.sign({ service }, serviceSecret, { expiresIn: "7d" });
}
