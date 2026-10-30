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

// AES-256-GCM замість DES: 256-бітний ключ (scrypt із секрету),
// унікальний випадковий IV для кожного шифрування та тег автентифікації.
const EXPORT_ALGORITHM = "aes-256-gcm";
const EXPORT_IV_LENGTH = 12;
const EXPORT_TAG_LENGTH = 16;
const EXPORT_KEY = crypto.scryptSync(LEGACY_EXPORT_KEY, "ai-prompt-hub:export", 32);

// Формат результату (hex): iv (12 байт) | authTag (16 байт) | ciphertext
export function legacyEncryptExport(plaintext: string): string {
  const iv = crypto.randomBytes(EXPORT_IV_LENGTH);
  const cipher = crypto.createCipheriv(EXPORT_ALGORITHM, EXPORT_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("hex");
}

export function legacyDecryptExport(ciphertext: string): string {
  const data = Buffer.from(ciphertext, "hex");
  if (data.length < EXPORT_IV_LENGTH + EXPORT_TAG_LENGTH) {
    throw new Error("Invalid export ciphertext");
  }
  const iv = data.subarray(0, EXPORT_IV_LENGTH);
  const tag = data.subarray(EXPORT_IV_LENGTH, EXPORT_IV_LENGTH + EXPORT_TAG_LENGTH);
  const encrypted = data.subarray(EXPORT_IV_LENGTH + EXPORT_TAG_LENGTH);
  const decipher = crypto.createDecipheriv(EXPORT_ALGORITHM, EXPORT_KEY, iv, {
    authTagLength: EXPORT_TAG_LENGTH,
  });
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
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
