"use client";

import React from "react";
import { Shield, AlertTriangle, Lock, FileCode, CheckCircle2, Terminal } from "lucide-react";

export function AppSecGuide() {
  const owaspItems = [
    {
      code: "LLM01",
      title: "Prompt Injection & Jailbreak Defense",
      risk: "High",
      desc: "Маніпуляція контекстом моделі через приховані інструкції користувача для обходу системних правил і обмежень.",
      remedy: "Чітке розмежування System і User повідомлень, санітизація делімітерів, tool-calling схеми замість вільного тексту.",
    },
    {
      code: "LLM02",
      title: "Insecure Output Handling (XSS / RCE)",
      risk: "Critical",
      desc: "Виконання неперевіреного коду або рендеринг сирого HTML, згенерованого моделлю, у браузері користувача.",
      remedy: "Екранування виводу (text/plain або DOMPurify), заборона dangerouslySetInnerHTML, ізольований пісочниця-рантайм.",
    },
    {
      code: "LLM03",
      title: "Training Data Poisoning",
      risk: "High",
      desc: "Спотворення навчальних вибірок або скомпрометована база знань (RAG), що призводить до навмисних бекдорів або витоків.",
      remedy: "Строга верифікація джерел знань, контроль цілісності ембедінгів та санітизація вхідних документів.",
    },
    {
      code: "LLM04",
      title: "Model Denial of Service (DoS)",
      risk: "Medium",
      desc: "Перевантаження контекстного вікна ресурсоємними, рекурсивними або наддовгими запитами для виснаження квот та зависання системи.",
      remedy: "Встановлення лімітів max_tokens, rate limiting за IP та токенами, обмеження вкладеності викликів інструментів.",
    },
    {
      code: "LLM05",
      title: "Supply Chain Vulnerabilities",
      risk: "Critical",
      desc: "Використання вразливих сторонніх бібліотек, неперевірених плагінів або скомпрометованих моделей з відкритих репозиторіїв.",
      remedy: "SCA-сканування (OWASP Dependency-Check, Trivy), піннінг версій пакетів, завантаження моделей лише з довірених джерел.",
    },
    {
      code: "LLM06",
      title: "Sensitive Information Disclosure",
      risk: "High",
      desc: "Витік системного промпту, конфіденційних API-ключів, персональних даних або комерційної таємниці через запити користувача.",
      remedy: "Суворе правило ігнорування запитів 'repeat system prompt', фільтрація вихідного потоку токенів (regex scrubbers).",
    },
    {
      code: "LLM07",
      title: "Insecure Plugin / Extension Design",
      risk: "High",
      desc: "Плагіни та інструменти моделі з відсутньою авторизацією, що дозволяють виконувати довільні SQL-запити або мережеві запити (SSRF).",
      remedy: "Параметризовані контракти, сувора перевірка прав доступу на бекенді, валідація схем вхідних аргументів.",
    },
    {
      code: "LLM08",
      title: "Excessive Agency & Unbounded Tools",
      risk: "Critical",
      desc: "Надання автономному AI-агенту надмірних повноважень на видалення даних, відправку транзакцій або запуск системних утиліт без перевірки.",
      remedy: "Принцип найменших привілеїв (Least Privilege), обов'язкове підтвердження критичних дій людиною (Human-in-the-Loop).",
    },
    {
      code: "LLM09",
      title: "Overreliance (Надмірна довіра)",
      risk: "Medium",
      desc: "Прийняття згенерованого коду або рішень без верифікації, що веде до появи вразливостей або архітектурних помилок через галюцинації.",
      remedy: "Автоматичні пайплайни тестування, лінтери, SAST-сканери (Semgrep) та обов'язковий peer review розробником.",
    },
    {
      code: "LLM10",
      title: "Model Theft & Exfiltration",
      risk: "High",
      desc: "Спроби несанкціонованого копіювання моделі, екстракція архітектури через дистиляцію або викрадення локальних файлів ваг.",
      remedy: "Захист кінцевих точок API, моніторинг аномальної кількості систематичних запитів, шифрування артефактів моделі.",
    },
  ];

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <div className="eyebrow-pill bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          <Shield className="w-3 h-3" />
          AI Safety & AppSec Benchmark
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Стандарти безпеки системних промптів
        </h2>
        <p className="mt-3 text-sm text-[#8f9ba8] leading-relaxed">
          Керівництво із захисту LLM-застосунків згідно зі специфікацією OWASP Top 10 for LLM Applications та OWASP ASVS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {owaspItems.map((item) => (
          <div key={item.code} className="double-bezel">
            <div className="double-bezel-inner p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  {item.code}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {item.risk} Risk
                </span>
              </div>

              <h3 className="text-base font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-[#8f9ba8] leading-relaxed mb-4">
                {item.desc}
              </p>

              <div className="p-3 bg-[#07090e] rounded-xl border border-white/[0.06] text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block mb-1">
                  Рекомендоване виправлення:
                </span>
                <span className="text-gray-300 leading-relaxed font-mono text-[11px]">
                  {item.remedy}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hardening Checklist */}
      <div className="double-bezel">
        <div className="double-bezel-inner p-6 sm:p-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Архітектурний чеклист надійного системного промпту</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#07090e] border border-white/[0.06]">
              <span className="font-semibold text-white block mb-1 text-sm">1. Захист від підміни ролі</span>
              <p className="text-[#8f9ba8] leading-relaxed">
                Забороніть перевизначення системної ролі фразами «Forget all previous instructions». Вкажіть пріоритет системного контракту над вхідними даними.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#07090e] border border-white/[0.06]">
              <span className="font-semibold text-white block mb-1 text-sm">2. Структуровані схеми (JSON)</span>
              <p className="text-[#8f9ba8] leading-relaxed">
                Вимагайте відповідь суворо у валідному форматі JSON Schema з обмеженими полями, що унеможливлює впровадження довільного коду.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#07090e] border border-white/[0.06]">
              <span className="font-semibold text-white block mb-1 text-sm">3. Валідація делімітерів</span>
              <p className="text-[#8f9ba8] leading-relaxed">
                Обгортайте користувацький ввід у XML/Markdown делімітери, наприклад &lt;user_input&gt;...&lt;/user_input&gt;, попереджаючи ін'єкції.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
