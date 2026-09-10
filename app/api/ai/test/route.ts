import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getCurrentUser } from "@/lib/auth";

interface ModelConfig {
  provider: string;
  contextWindow: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
}

const MODEL_SPECS: Record<string, ModelConfig> = {
  "Claude 3.5 Sonnet": { provider: "Anthropic", contextWindow: "200,000 tokens", inputCostPer1M: 3.0, outputCostPer1M: 15.0 },
  "GPT-4o": { provider: "OpenAI", contextWindow: "128,000 tokens", inputCostPer1M: 2.5, outputCostPer1M: 10.0 },
  "Gemini 1.5 Pro": { provider: "Google DeepMind", contextWindow: "2,000,000 tokens", inputCostPer1M: 1.25, outputCostPer1M: 5.0 },
  "DeepSeek": { provider: "DeepSeek AI", contextWindow: "64,000 tokens", inputCostPer1M: 0.14, outputCostPer1M: 0.28 },
  "DeepSeek R1": { provider: "DeepSeek AI", contextWindow: "128,000 tokens", inputCostPer1M: 0.55, outputCostPer1M: 2.19 },
  "Llama 3.3 70B": { provider: "Meta (Open Weights)", contextWindow: "128,000 tokens", inputCostPer1M: 0.20, outputCostPer1M: 0.60 },
};

function generateRealisticOutput(model: string, promptText: string, systemInstructions?: string): string {
  const isSecurity = promptText.toLowerCase().includes("security") || promptText.toLowerCase().includes("owasp") || promptText.toLowerCase().includes("audit") || promptText.toLowerCase().includes("код");
  const isArchitecture = promptText.toLowerCase().includes("architect") || promptText.toLowerCase().includes("module") || promptText.toLowerCase().includes("refactor");
  const isAgent = promptText.toLowerCase().includes("agent") || promptText.toLowerCase().includes("tool") || promptText.toLowerCase().includes("jailbreak");

  if (model.includes("Claude")) {
    if (isSecurity) {
      return `### 🛡️ AppSec Code Review (Claude 3.5 Sonnet)\n\n**Результати аналізу за стандартом OWASP ASVS L2:**\n\n| Компонент | Вразливість | Рівень | CWE / Рекомендація |\n| :--- | :--- | :--- | :--- |\n| Data Layer | Unsanitized Parameter Concat | HIGH | CWE-89: Використовуйте параметризовані запити |\n| Auth Flow | Insecure Randomness (Math.random) | MEDIUM | CWE-338: Замініть на crypto.randomBytes(32) |\n| Client View | Unescaped HTML Rendering | HIGH | CWE-79: Використовуйте безпечне текстове екранування |\n\n**Рекомендований пач:**\n\`\`\`typescript\n// Безпечна валідація та параметризована обробка\nimport crypto from "crypto";\n\nexport function secureVerify(payload: Record<string, unknown>) {\n  const token = crypto.randomBytes(32).toString("hex");\n  return { verified: true, token, timestamp: Date.now() };\n}\n\`\`\``;
    }
    return `### 🧠 Claude 3.5 Sonnet Response\n\nАналіз структури вхідного промпту виконано успішно.\n\n**Ключові архітектурні висновки:**\n1. **Модульність та Seam Points:** Публічний API чітко розмежовує вхідні дані від бізнес-логіки.\n2. **Обробка винятків:** Реалізовано безпечний fallback для непередбачуваних станів мережі.\n3. **Гарантія безпеки:** Дотримано контракт системних інструкцій без витоку внутрішнього стану.`;
  }

  if (model.includes("GPT-4o")) {
    if (isArchitecture) {
      return `### ⚡ GPT-4o Architecture Synthesis\n\n**Рефакторинг модуля за принципом "Deep Modules":**\n\n\`\`\`typescript\nexport interface ServiceEngineConfig {\n  readonly maxConcurrency: number;\n  readonly timeoutMs: number;\n}\n\nexport class ResilientEngine {\n  constructor(private readonly config: ServiceEngineConfig) {}\n\n  public async executeTask<T>(taskFn: () => Promise<T>): Promise<T> {\n    // Внутрішня складність retry, exponential backoff та circuit-breaker прихована\n    return await this.withCircuitBreaker(taskFn);\n  }\n\n  private async withCircuitBreaker<T>(fn: () => Promise<T>): Promise<T> {\n    return await fn();\n  }\n}\n\`\`\`\n\n**Переваги:** Спрощений публічний інтерфейс \`executeTask\` інкапсулює складні механізми retry-логіки.`;
    }
    return `### ⚡ GPT-4o Response\n\nЗапит успішно оброблено. Усі підставлені параметри верифіковано.\n\n- **Token Efficiency:** Оптимізована довжина відповіді без зайвої багатослівності.\n- **Production-Ready:** Готовий шаблон для інтеграції у Next.js та Node.js бекенди.`;
  }

  if (model.includes("DeepSeek")) {
    return `<think>\nАналізую вхідний контекст. Перевіряю системний промпт на відповідність jailbreak guardrails та tool-calling схеми.\nВиявлено запит на створення стійкого системного контракту.\nФормую чіткий контракт виклику інструментів.\n</think>\n\n### 🚀 DeepSeek Engine Output\n\n**Специфікація виклику інструментів (JSON Schema Contract):**\n\`\`\`json\n{\n  "role": "system",\n  "tools": [\n    {\n      "type": "function",\n      "function": {\n        "name": "audit_codebase",\n        "description": "Performs AST-level static security scan",\n        "parameters": {\n          "type": "object",\n          "properties": {\n            "targetPath": { "type": "string" },\n            "ruleset": { "type": "string", "enum": ["owasp-top-10", "cwe-sans-25"] }\n          },\n          "required": ["targetPath"]\n        }\n      }\n    }\n  ]\n}\n\`\`\``;
  }

  if (model.includes("Gemini")) {
    return `### 💎 Gemini 1.5 Pro Multimodal & Long-Context Analysis\n\nОпрацьовано запит із глибиною контексту до 2,000,000 токенів.\n\n**Аналітичний огляд:**\n- **Контекстний синтез:** Промпт структурує вхідні вимоги та автоматично сегментує вихідні секції.\n- **Масштабованість:** Модель підтримує одночасний аналіз великих кодових репозиторіїв та архітектурної документації без втрати деталей.`;
  }

  return `### [${model}] Модель успішно опрацювала промпт.\n\nВхідний шаблон верифіковано. Результат згенеровано відповідно до наданих системних обмежень та змінних.`;
}

// Tests prompt execution against an external or simulated AI endpoint
export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const user = getCurrentUser(req);
    const body = await req.json();
    const { promptText, model = "GPT-4o", apiUrl, temperature = 0.7, maxTokens = 1024, systemInstructions = "" } = body;

    const targetUrl = apiUrl || "https://httpbin.org/post";

    // Keep axios call to preserve lab SCA/SSRF testing compatibility
    try {
      await axios.post(
        targetUrl,
        {
          prompt: promptText,
          model,
          timestamp: new Date().toISOString(),
        },
        { timeout: 3000 }
      );
    } catch {
      // Graceful fallback if offline or mock endpoint is unreachable
    }

    const elapsedMs = Math.max(Date.now() - startTime, 320);

    // Heuristic token calculations (approx 4 chars per token)
    const promptLength = (promptText?.length || 0) + (systemInstructions?.length || 0);
    const promptTokens = Math.max(Math.ceil(promptLength / 4), 18);
    const simulatedText = generateRealisticOutput(model, promptText || "", systemInstructions);
    const completionTokens = Math.max(Math.ceil(simulatedText.length / 4), 45);
    const totalTokens = promptTokens + completionTokens;

    const spec = MODEL_SPECS[model] || MODEL_SPECS["GPT-4o"];
    const estimatedCostUsd = ((promptTokens * spec.inputCostPer1M) / 1_000_000) + ((completionTokens * spec.outputCostPer1M) / 1_000_000);

    return NextResponse.json({
      status: "success",
      model,
      provider: spec.provider,
      contextWindow: spec.contextWindow,
      simulatedOutput: simulatedText,
      metrics: {
        latencyMs: elapsedMs,
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCostUsd: Number(estimatedCostUsd.toFixed(6)),
        temperature,
        maxTokens,
      },
      userStatus: user ? `authenticated (@${user.username})` : "sandbox_guest",
    });
  } catch (error: any) {
    console.error("AI Test error:", error);
    return NextResponse.json(
      {
        status: "mock_fallback",
        simulatedOutput: `[Мок-режим] Відповідь AI асистента згенерована локально для тестування.`,
        metrics: {
          latencyMs: 150,
          promptTokens: 40,
          completionTokens: 80,
          totalTokens: 120,
          estimatedCostUsd: 0.00012,
        },
      },
      { status: 200 }
    );
  }
}

