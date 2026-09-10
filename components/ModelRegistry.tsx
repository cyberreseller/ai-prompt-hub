"use client";

import React from "react";
import { Cpu, Zap, Shield, ArrowUpRight, CheckCircle2, Layers, DollarSign, Sparkles } from "lucide-react";

export interface ModelSpec {
  id: string;
  name: string;
  provider: string;
  contextWindow: string;
  contextTokens: number;
  inputCostPer1M: string;
  outputCostPer1M: string;
  latencyRating: "Ultra Fast" | "Fast" | "Balanced" | "Deep Reasoning";
  strengths: string[];
  recommendedUse: string;
  badgeColor: string;
  borderAccent: string;
  description: string;
}

export const SUPPORTED_MODELS: ModelSpec[] = [
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextWindow: "200,000 tokens",
    contextTokens: 200000,
    inputCostPer1M: "$3.00",
    outputCostPer1M: "$15.00",
    latencyRating: "Fast",
    strengths: ["#1 в AppSec Code Review", "Глибокий аналіз архітектури", "Бездоганний TDD & рефакторинг"],
    recommendedUse: "Статичний аналіз коду, пошук дефектів ASVS/OWASP, перевірка криптографії та рефакторинг спагеті-коду.",
    badgeColor: "bg-[#d97757]/15 text-[#f09a80] border-[#d97757]/30",
    borderAccent: "hover:border-[#d97757]/50",
    description: "Еталонна модель для інженерії програмного забезпечення та аналізу вразливостей з найвищою точністю виправлення.",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    contextWindow: "128,000 tokens",
    contextTokens: 128000,
    inputCostPer1M: "$2.50",
    outputCostPer1M: "$10.00",
    latencyRating: "Ultra Fast",
    strengths: ["Мультимодальність", "Генерація CI/CD workflows", "Швидка валідація схем"],
    recommendedUse: "Швидка розробка API, CI/CD автоматизація (GitHub Actions), Dockerfile сканування та інтеграційні тести.",
    badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    borderAccent: "hover:border-emerald-500/50",
    description: "Флагманська мультимодальна модель OpenAI з блискавичним часом генерації та широкою підтримкою бібліотек.",
  },
  {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google DeepMind",
    contextWindow: "2,000,000 tokens",
    contextTokens: 2000000,
    inputCostPer1M: "$1.25",
    outputCostPer1M: "$5.00",
    latencyRating: "Balanced",
    strengths: ["Гігантський контекст (2M)", "Аналіз повних монорепозиторіїв", "Аудит системних логів"],
    recommendedUse: "Завантаження повного вихідного коду проєкту разом із документацією та виявлення глобальних архітектурних розривів.",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    borderAccent: "hover:border-blue-500/50",
    description: "Революційне контекстне вікно у 2 мільйони токенів дозволяє аналізувати сотні файлів за один запит.",
  },
  {
    id: "deepseek",
    name: "DeepSeek V3 / R1",
    provider: "DeepSeek AI",
    contextWindow: "64,000 - 128,000 tokens",
    contextTokens: 128000,
    inputCostPer1M: "$0.14 - $0.55",
    outputCostPer1M: "$0.28 - $2.19",
    latencyRating: "Deep Reasoning",
    strengths: ["Ланцюги міркувань (<think>)", "Математична та логічна точність", "Ультранизька вартість"],
    recommendedUse: "Tool-calling контракти для AI-агентів, захист від prompt injection, складні алгоритмічні оптимізації.",
    badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    borderAccent: "hover:border-cyan-500/50",
    description: "Високопродуктивна відкрита модель із ланцюгом явних міркувань для перевірки безпеки системних промптів.",
  },
  {
    id: "llama-3-3",
    name: "Llama 3.3 70B",
    provider: "Meta (Open Weights)",
    contextWindow: "128,000 tokens",
    contextTokens: 128000,
    inputCostPer1M: "$0.20",
    outputCostPer1M: "$0.60",
    latencyRating: "Fast",
    strengths: ["Повна приватність (On-Prem)", "Відкриті ваги", "Гнучкий fine-tuning"],
    recommendedUse: "Локальний запуск в ізольованому контурі підприємства для обробки чутливих даних без відправки на зовнішні сервери.",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    borderAccent: "hover:border-purple-500/50",
    description: "Найпотужніша відкрита модель для розгортання всередині периметра компанії без ризику витоку коду.",
  },
];

interface ModelRegistryProps {
  onSelectModel: (modelName: string) => void;
  onFilterCatalog: (modelName: string) => void;
}

export function ModelRegistry({ onSelectModel, onFilterCatalog }: ModelRegistryProps) {
  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="eyebrow-pill bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
          <Cpu className="w-3 h-3" />
          LLM Registry & Benchmark Matrix
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Каталог інтегрованих моделей LLM
        </h2>
        <p className="mt-3 text-sm text-[#8f9ba8] leading-relaxed">
          Порівняльні характеристики контекстних вікон, архітектурних переваг та вартості для оптимізації вашого стеку.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUPPORTED_MODELS.map((m) => (
          <div
            key={m.id}
            className={`double-bezel transition-all duration-300 ${m.borderAccent}`}
          >
            <div className="double-bezel-inner p-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`text-[11px] font-mono px-3 py-1 rounded-full border font-medium ${m.badgeColor}`}>
                    {m.name}
                  </span>
                  <span className="text-[11px] font-mono text-[#8f9ba8]">
                    {m.provider}
                  </span>
                </div>

                <p className="text-xs text-[#8f9ba8] leading-relaxed mb-4">
                  {m.description}
                </p>

                {/* Specs Box */}
                <div className="p-3.5 rounded-xl bg-[#07090e] border border-white/[0.06] space-y-2.5 mb-4 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f9ba8] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      Контекстне вікно:
                    </span>
                    <span className="text-white font-semibold">{m.contextWindow}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8f9ba8] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Швидкодія:
                    </span>
                    <span className="text-emerald-400 font-medium">{m.latencyRating}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/[0.06] pt-2 text-[11px]">
                    <span className="text-[#8f9ba8] flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      Вартість (In / Out):
                    </span>
                    <span className="text-gray-300">{m.inputCostPer1M} / {m.outputCostPer1M}</span>
                  </div>
                </div>

                {/* Strengths */}
                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#8f9ba8] block mb-2">
                    Ключові переваги:
                  </span>
                  <ul className="space-y-1 text-xs text-gray-300">
                    {m.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2">
                <button
                  onClick={() => onSelectModel(m.name)}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-600/25 active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>В Playground</span>
                </button>
                <button
                  onClick={() => onFilterCatalog(m.name)}
                  title="Показати промпти для цієї моделі"
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-[#8f9ba8] hover:text-white border border-white/[0.08] transition-colors"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
