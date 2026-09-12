"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Sparkles,
  SlidersHorizontal,
  Code2,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Coins,
  Cpu,
  Terminal,
  Layers,
  ChevronDown,
  ChevronUp,
  FileCode,
  Share2,
} from "lucide-react";
import { ExportModal } from "./ExportModal";

export interface PromptItem {
  id: string;
  title: string;
  description: string;
  systemInstructions: string;
  promptTemplate: string;
  modelType: string;
  category: string;
  tags: string;
  views: number;
  copies: number;
  averageRating: number;
  ratingsCount: number;
  author: {
    id: string;
    username: string;
  };
}

interface LlmPlaygroundProps {
  prompts: PromptItem[];
  initialPrompt?: PromptItem | null;
  onToast: (msg: string) => void;
}

export const DEMO_VARIABLE_VALUES: Record<string, string> = {
  language: "typescript",
  code: `export async function handleLogin(req) {\n  const { email, password } = req.body;\n  const query = "SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'";\n  return await db.raw(query);\n}`,
  plan: "Розділити моноліт на 3 мікросервіси зі спільною базою даних та синхронними HTTP-викликами без черг повідомлень.",
  tools: "execute_sql, fetch_http, read_file, send_email, write_db",
  stack: "Next.js 14, TypeScript, Prisma ORM, PostgreSQL, Docker",
  feature_description: "Система динамічного обмеження швидкості запитів (Rate Limiting) за IP та двофакторна автентифікація TOTP",
  agent_role: "DevSecOps Security & Compliance Auditor",
  requirement: "Платіжна транзакція у статусах (Pending, Settled, Failed, Refunded) із суворою забороною повторної обробки (idempotency token) та аудиторським логом.",
  crypto_scheme: "Генерація сесійного токена через MD5(timestamp + userId + Math.random()) з періодом ротації 24 години.",
  decision_context: "Перехід від REST API до gRPC для внутрішнього зв'язку мікросервісів у зв'язку з високими навантаженнями (10k rps) та затримками JSON-серіалізації.",
  api_changes: `{\n  "deprecated": "/v1/auth/login",\n  "new_endpoint": "/v2/auth/oauth/token",\n  "breaking": "Параметр 'username' замінено на 'grant_type' та 'client_id'",\n  "auth_header": "Bearer <JWT> замість Basic Auth"\n}`,
  task_description: "Провести повний аудит вразливостей репозиторію, скласти таблицю ризиків OWASP, оновити залежності через PR та запустити димове тестування.",
};

export function LlmPlayground({ prompts, initialPrompt, onToast }: LlmPlaygroundProps) {
  const [selectedPromptId, setSelectedPromptId] = useState<string>(initialPrompt?.id || (prompts[0]?.id ?? "custom"));
  const [activeModel, setActiveModel] = useState<string>(initialPrompt?.modelType || "Claude 3.5 Sonnet");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(1024);
  const [systemInstructions, setSystemInstructions] = useState<string>(initialPrompt?.systemInstructions || "");
  const [promptTemplate, setPromptTemplate] = useState<string>(initialPrompt?.promptTemplate || "");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [compiledPrompt, setCompiledPrompt] = useState<string>("");

  // System instructions toggle
  const [showSystemPrompt, setShowSystemPrompt] = useState<boolean>(true);

  // Execution state
  const [loading, setLoading] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{
    latencyMs?: number;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    estimatedCostUsd?: number;
    contextWindow?: string;
    provider?: string;
  } | null>(null);

  // Export Modal
  const [exportOpen, setExportOpen] = useState<boolean>(false);
  const [copiedResult, setCopiedResult] = useState<boolean>(false);

  // When initialPrompt changes or prompts load
  useEffect(() => {
    if (initialPrompt) {
      setSelectedPromptId(initialPrompt.id);
      setActiveModel(initialPrompt.modelType || "Claude 3.5 Sonnet");
      setSystemInstructions(initialPrompt.systemInstructions || "");
      setPromptTemplate(initialPrompt.promptTemplate || "");
    } else if (prompts.length > 0 && selectedPromptId === "custom") {
      // Keep custom or pick first
    }
  }, [initialPrompt]);

  // When selected prompt changes from dropdown
  const handleSelectPrompt = (id: string) => {
    setSelectedPromptId(id);
    if (id === "custom") {
      setPromptTemplate("Проаналізуй наступний код на наявність вразливостей:\n```{{language}}\n{{code}}\n```");
      setSystemInstructions("Ти — провідний експерт з інформаційної безпеки.");
      setActiveModel("Claude 3.5 Sonnet");
      setVariables({
        language: "typescript",
        code: DEMO_VARIABLE_VALUES.code,
      });
      return;
    }
    const found = prompts.find((p) => p.id === id);
    if (found) {
      setPromptTemplate(found.promptTemplate);
      setSystemInstructions(found.systemInstructions);
      setActiveModel(found.modelType);
      setExecutionResult(null);
      setMetrics(null);

      const vars = Array.from(
        new Set((found.promptTemplate.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || []).map((v) => v.slice(2, -2)))
      );
      const newVars: Record<string, string> = {};
      vars.forEach((v) => {
        newVars[v] = DEMO_VARIABLE_VALUES[v] || "";
      });
      setVariables(newVars);
    }
  };

  // Detect {{variable}} placeholders in template
  const detectedVariables = Array.from(
    new Set((promptTemplate.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || []).map((v) => v.slice(2, -2)))
  );

  // Initialize variable defaults
  useEffect(() => {
    setVariables((prev) => {
      const updated = { ...prev };
      let changed = false;
      detectedVariables.forEach((v) => {
        if (updated[v] === undefined) {
          updated[v] = DEMO_VARIABLE_VALUES[v] || "";
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [promptTemplate, detectedVariables]);

  // Compile final prompt with substituted variables
  useEffect(() => {
    let result = promptTemplate;
    Object.entries(variables).forEach(([key, val]) => {
      result = result.replaceAll(`{{${key}}}`, val || `{{${key}}}`);
    });
    setCompiledPrompt(result);
  }, [promptTemplate, variables]);

  const handleVariableChange = (key: string, val: string) => {
    setVariables((prev) => ({ ...prev, [key]: val }));
  };

  const handleFillDemoValues = () => {
    const updated: Record<string, string> = { ...variables };
    detectedVariables.forEach((v) => {
      updated[v] = DEMO_VARIABLE_VALUES[v] || `Тестові вхідні дані для ${v}`;
    });
    setVariables(updated);
    onToast("Демо-значення підставлено!");
  };

  const handleRunExecution = async () => {
    setLoading(true);
    setExecutionResult(null);
    try {
      const res = await fetch("/api/ai/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptText: compiledPrompt,
          model: activeModel,
          temperature,
          maxTokens,
          systemInstructions,
        }),
      });
      const data = await res.json();
      setExecutionResult(data.simulatedOutput);
      if (data.metrics) {
        setMetrics({
          ...data.metrics,
          contextWindow: data.contextWindow,
          provider: data.provider,
        });
      }
      onToast(`Виконання на ${activeModel} завершено!`);
    } catch (err) {
      setExecutionResult("Помилка зв'язку з AI ендпоінтом тестування.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyResult = async () => {
    if (!executionResult) return;
    await navigator.clipboard.writeText(executionResult);
    setCopiedResult(true);
    onToast("Результат скопійовано в буфер!");
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const modelsList = [
    { name: "Claude 3.5 Sonnet", badge: "Anthropic" },
    { name: "GPT-4o", badge: "OpenAI" },
    { name: "Gemini 1.5 Pro", badge: "Google DeepMind" },
    { name: "DeepSeek", badge: "DeepSeek V3" },
    { name: "Llama 3.3 70B", badge: "Meta Open" },
  ];

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="eyebrow-pill bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Cpu className="w-3 h-3" />
            Interactive Testing Bench
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            LLM Playground & Model Arena
          </h2>
          <p className="mt-1 text-sm text-[#8f9ba8]">
            Тестуйте системні промпти з живими змінними, порівнюйте вивід різних моделей та аналізуйте токени.
          </p>
        </div>

        {/* Prompt selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8f9ba8] font-mono">Промпт:</span>
          <select
            value={selectedPromptId}
            onChange={(e) => handleSelectPrompt(e.target.value)}
            className="bg-[#0d111a] border border-white/15 text-xs rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-indigo-500 max-w-xs truncate"
          >
            <option value="custom">Власний / Довільний промпт</option>
            {prompts.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.modelType}] {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Playground Workspace (Two-Column IDE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration & Prompt Setup (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Model Selector Pills */}
          <div className="double-bezel">
            <div className="double-bezel-inner p-4 sm:p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8f9ba8] block mb-3">
                Оберіть рушій моделі (LLM Engine):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {modelsList.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setActiveModel(m.name)}
                    className={`px-3 py-2 rounded-xl text-left transition-all border ${
                      activeModel === m.name
                        ? "bg-indigo-600/20 border-indigo-500 text-white shadow-sm"
                        : "bg-[#07090e] border-white/[0.06] text-[#8f9ba8] hover:text-white hover:border-white/20"
                    }`}
                  >
                    <div className="text-xs font-semibold">{m.name}</div>
                    <div className="text-[10px] font-mono opacity-70">{m.badge}</div>
                  </button>
                ))}
              </div>

              {/* Hyperparameter Sliders */}
              <div className="mt-5 pt-4 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[#8f9ba8] font-mono">Temperature:</span>
                    <span className="font-mono text-indigo-400 font-bold">{temperature.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.0}
                    max={1.0}
                    step={0.05}
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] text-[#525e6f] font-mono mt-1">
                    <span>Точний (0.0)</span>
                    <span>Креативний (1.0)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[#8f9ba8] font-mono">Max Output Tokens:</span>
                    <span className="font-mono text-indigo-400 font-bold">{maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min={256}
                    max={4096}
                    step={128}
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-[10px] text-[#525e6f] font-mono mt-1">
                    <span>256 (Стисло)</span>
                    <span>4096 (Розширено)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Instructions Box */}
          <div className="double-bezel">
            <div className="double-bezel-inner p-4 sm:p-5">
              <button
                onClick={() => setShowSystemPrompt(!showSystemPrompt)}
                className="w-full flex items-center justify-between text-left text-xs font-mono uppercase tracking-wider text-[#8f9ba8] hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Системна інструкція (System Prompt)</span>
                </div>
                {showSystemPrompt ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showSystemPrompt && (
                <div className="mt-3">
                  <textarea
                    rows={3}
                    value={systemInstructions}
                    onChange={(e) => setSystemInstructions(e.target.value)}
                    placeholder="Введіть рольові обмеження для моделі..."
                    className="w-full bg-[#07090e] border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Variables Injection Panel */}
          {detectedVariables.length > 0 && (
            <div className="double-bezel">
              <div className="double-bezel-inner p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">
                      Змінні шаблону ({detectedVariables.length}):
                    </span>
                  </div>
                  <button
                    onClick={handleFillDemoValues}
                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline"
                  >
                    Заповнити демо-значеннями
                  </button>
                </div>

                <div className="space-y-3">
                  {detectedVariables.map((v) => (
                    <div key={v}>
                      <label className="block text-[11px] font-mono text-emerald-400 mb-1">
                        {`{{${v}}}`}
                      </label>
                      {["code", "plan", "requirement", "decision_context", "api_changes", "task_description", "crypto_scheme"].includes(v) || (variables[v] && variables[v].includes("\n")) ? (
                        <textarea
                          rows={3}
                          value={variables[v] || ""}
                          onChange={(e) => handleVariableChange(v, e.target.value)}
                          placeholder={`Введіть значення для ${v}...`}
                          className="w-full bg-[#07090e] border border-emerald-500/25 rounded-xl p-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                        />
                      ) : (
                        <input
                          type="text"
                          value={variables[v] || ""}
                          onChange={(e) => handleVariableChange(v, e.target.value)}
                          placeholder={`Значення для ${v}...`}
                          className="w-full bg-[#07090e] border border-emerald-500/25 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Prompt Template & Live Preview */}
          <div className="double-bezel">
            <div className="double-bezel-inner p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8f9ba8]">
                  Тіло промпту / Шаблон:
                </span>
                <span className="text-[11px] font-mono text-[#8f9ba8]">
                  ~{Math.ceil(compiledPrompt.length / 4)} токенів
                </span>
              </div>
              <textarea
                rows={4}
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                className="w-full bg-[#07090e] border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />

              {/* Live compiled preview box */}
              {detectedVariables.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 block mb-1.5">
                    Live Compiled Prompt (підставлений результат):
                  </span>
                  <pre className="p-3 bg-[#07090e] border border-white/[0.04] rounded-xl text-[11px] font-mono text-gray-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {compiledPrompt}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Execution Console & Results (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-5">
          <div className="double-bezel flex-1 flex flex-col">
            <div className="double-bezel-inner p-5 flex-1 flex flex-col">
              {/* Console Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs text-white font-medium">Output Console</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExportOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs text-[#8f9ba8] hover:text-white border border-white/10 transition-colors flex items-center gap-1 font-mono text-[11px]"
                  >
                    <FileCode className="w-3 h-3" />
                    <span>Експорт</span>
                  </button>

                  <button
                    onClick={() => {
                      setExecutionResult(null);
                      setMetrics(null);
                    }}
                    title="Очистити"
                    className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[#8f9ba8] hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Metrics Bar */}
              {metrics && (
                <div className="mt-4 p-3 rounded-xl bg-[#07090e] border border-white/[0.06] grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#8f9ba8] block">Latency</span>
                    <span className="text-emerald-400 font-bold">{metrics.latencyMs}ms</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8f9ba8] block">Total Tokens</span>
                    <span className="text-indigo-400 font-bold">{metrics.totalTokens}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8f9ba8] block">Cost (Est.)</span>
                    <span className="text-amber-400 font-bold">${metrics.estimatedCostUsd}</span>
                  </div>
                </div>
              )}

              {/* Console Body */}
              <div className="mt-4 flex-1 min-h-[320px] bg-[#07090e] rounded-2xl border border-white/[0.06] p-4 font-mono text-xs leading-relaxed overflow-y-auto relative">
                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-[#8f9ba8] space-y-3 py-16">
                    <Sparkles className="w-6 h-6 text-indigo-400 animate-spin" />
                    <span>Генерація відповіді на {activeModel}...</span>
                    <span className="text-[11px] text-[#525e6f]">Застосовуються системні інструкції та guardrails</span>
                  </div>
                ) : executionResult ? (
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
                      <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">
                        {activeModel} Response
                      </span>
                      <button
                        onClick={handleCopyResult}
                        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedResult ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedResult ? "Скопійовано" : "Копіювати"}</span>
                      </button>
                    </div>
                    <div className="text-gray-200 whitespace-pre-wrap">
                      {executionResult}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-[#525e6f] py-16">
                    <Terminal className="w-8 h-8 mb-2 opacity-50 text-indigo-400" />
                    <p className="text-xs">Консоль очікує на запуск.</p>
                    <p className="text-[11px] mt-1">
                      Оберіть модель, налаштуйте змінні та натисніть «Запустити виконання».
                    </p>
                  </div>
                )}
              </div>

              {/* Run Button Footer */}
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <button
                  onClick={handleRunExecution}
                  disabled={loading}
                  className="w-full group flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white text-xs font-bold tracking-wide uppercase shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{loading ? "Виконується запит..." : `Запустити виконання на ${activeModel}`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Export Modal */}
      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        title={prompts.find((p) => p.id === selectedPromptId)?.title || "Custom Prompt Playground"}
        model={activeModel}
        systemPrompt={systemInstructions}
        promptTemplate={promptTemplate}
        compiledPrompt={compiledPrompt}
        onCopySuccess={onToast}
      />
    </section>
  );
}
