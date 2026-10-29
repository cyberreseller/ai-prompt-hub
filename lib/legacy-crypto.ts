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

// --- Інтеграція з HashiCorp Vault для отримання секретів ---
const VAULT_ADDR = process.env.VAULT_ADDR || "http://127.0.0.1:8200";
const VAULT_TOKEN = process.env.VAULT_TOKEN || "";

async function getJwtSecretFromVault(secretKey: string): Promise<string> {
  const response = await fetch(`${VAULT_ADDR}/v1/secret/data/jwt`, {
    method: "GET",
    headers: {
      "X-Vault-Token": VAULT_TOKEN,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch secret '${secretKey}' from Vault`);
  }

  const payload = await response.json();
  const secretValue = payload?.data?.data?.[secretKey];

  if (!secretValue) {
    throw new Error(`Secret '${secretKey}' is missing in Vault`);
  }

  return secretValue;
}
// ----------------------------------------------------------

export async function signPreviewToken(payload: Record<string, unknown>): Promise<string> {
  // Дістаємо секрет із Vault замість хардкоду
  const previewSecret = await getJwtSecretFromVault("previewShareSecret");
  return jwt.sign(payload, previewSecret, {
    expiresIn: "1h",
  });
}

export async function signServiceToken(service: string): Promise<string> {
  // Дістаємо секрет із Vault замість хардкоду
  const serviceSecret = await getJwtSecretFromVault("serviceTokenSecret");
  return jwt.sign({ service }, serviceSecret, { expiresIn: "7d" });
}