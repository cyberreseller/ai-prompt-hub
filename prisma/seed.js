const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean old records
  await prisma.rating.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@prompthub.io",
      username: "admin_cyber",
      passwordHash,
      role: "ADMIN",
    },
  });

  const author1 = await prisma.user.create({
    data: {
      email: "alex.dev@prompthub.io",
      username: "alex_architect",
      passwordHash,
      role: "USER",
    },
  });

  const author2 = await prisma.user.create({
    data: {
      email: "olena.sec@prompthub.io",
      username: "olena_sec",
      passwordHash,
      role: "USER",
    },
  });

  // 2. Initial Prompts
  const promptsData = [
    {
      title: "Senior Security Code Reviewer (OWASP Top 10 & CWE)",
      description: "Глибокий аудит вихідного коду на вразливості, витоки пам'яті та архітектурні дефекти.",
      systemInstructions: "Ви — провідний AppSec інженер. Аналізуйте наданий код з позиції стандарту ASVS та OWASP Top 10. Формуйте звіт у таблиці: вразливість, CVE/CWE, рівень критичності, рекомендація з виправлення.",
      promptTemplate: "Проведи аудит наступного коду на наявність вразливостей:\n```{{language}}\n{{code}}\n```\nЗверни особливу увагу на валідацію вхідних даних та аутентифікацію.",
      modelType: "Claude 3.5 Sonnet",
      category: "Security",
      tags: "security, sast, owasp, code-review, audit",
      authorId: author2.id,
      views: 342,
      copies: 87,
    },
    {
      title: "Clean Architecture & Deep Module Refactoring",
      description: "Розбиття спагеті-коду на високоефективні модулі за філософією Джона Остерхаута (A Philosophy of Software Design).",
      systemInstructions: "Ти — досвідчений архітектор ПЗ. Допомагай проектувати глибокі модулі з простим публічним інтерфейсом та прихованою внутрішньою складністю. Забороняй pass-through методи та надлишкові шари абстракцій.",
      promptTemplate: "Ось поточна реалізація модуля:\n```{{language}}\n{{code}}\n```\nЗапропонуй рефакторинг згідно з концепцією Deep Modules. Поясни інтерфейс і seam points.",
      modelType: "GPT-4o",
      category: "Coding",
      tags: "architecture, refactoring, clean-code, typescript",
      authorId: author1.id,
      views: 512,
      copies: 134,
    },
    {
      title: "Relentless Interviewer & Requirements Grilling",
      description: "Стрес-тестування технічного плану або архітектури шляхом послідовних раундів запитань.",
      systemInstructions: "Ніколи не погоджуйся одразу. Знайди неявні припущення в плані розробника і постав 3 жорстких запитання щодо масштабованості, відмовостійкості та безпеки.",
      promptTemplate: "Ось мій архітектурний план:\n{{plan}}\nПротестуй його на міцність. Знайди найслабші місця.",
      modelType: "Claude 3.5 Sonnet",
      category: "System",
      tags: "interview, design-tree, architecture, planning",
      authorId: admin.id,
      views: 290,
      copies: 65,
    },
    {
      title: "DevSecOps CI/CD Pipeline Automation (GitHub Actions)",
      description: "Генерація готового робочого процесу CI/CD із інтегрованими сканерами Semgrep, Trivy та SonarQube.",
      systemInstructions: "Створюй production-ready файли workflow для GitHub Actions з кешуванням залежностей, кроками лінтингу, SAST, SCA та перевіркою секретів за допомогою git-secrets.",
      promptTemplate: "Створи GitHub Actions workflow для проєкту на {{stack}}. Додай кроки для: 1) Semgrep SAST 2) Dependency-Check 3) Trivy Docker scan.",
      modelType: "GPT-4o",
      category: "Security",
      tags: "devsecops, cicd, trivy, semgrep, github-actions",
      authorId: author2.id,
      views: 418,
      copies: 112,
    },
    {
      title: "Technical Writing & Developer Documentation Spec",
      description: "Перетворення технічних вимог у вичерпні Markdown-специфікації для розробників.",
      systemInstructions: "Пиши чітко, лаконічно, використовуючи активний стан дієслів. Структуруй: Problem Statement, Solution, User Stories, Out of Scope.",
      promptTemplate: "Склади технічну специфікацію для фічі:\n{{feature_description}}",
      modelType: "Gemini 1.5 Pro",
      category: "Writing",
      tags: "documentation, spec, markdown, to-spec",
      authorId: author1.id,
      views: 185,
      copies: 42,
    },
    {
      title: "AI Agent System Prompt & Tool-Calling Persona",
      description: "Створення надійного системного промпту для агентів із захистом від Jailbreak та Prompt Injection.",
      systemInstructions: "Ти — експерт з AI Safety. Формулюй інструкції для AI агентів з чіткими межами дозволених інструментів та захистом системного промпту від витоку через user input.",
      promptTemplate: "Створи системний промпт для AI-асистента в ролі {{agent_role}}. Асистент має доступ до наступних інструментів: {{tools}}.",
      modelType: "DeepSeek",
      category: "System",
      tags: "system-prompt, ai-agent, prompt-injection, security",
      authorId: admin.id,
      views: 673,
      copies: 204,
    },
    {
      title: "On-Premises Privacy & Air-Gapped Code Review",
      description: "Глибокий аналіз коду в ізольованому контурі підприємства без передачі даних на зовнішні хмарні сервери.",
      systemInstructions: "Ти — безпековий аудитор внутрішнього контуру. Перевіряй вихідний код на відповідність внутрішнім політикам конфіденційності та наявність захардкоджених токенів чи паролів.",
      promptTemplate: "Перевір наступний фрагмент конфігурації або коду:\n```{{language}}\n{{code}}\n```\nВкажи на витоки чутливих даних та порушення приватності.",
      modelType: "Llama 3.3 70B",
      category: "Security",
      tags: "privacy, on-prem, llama, air-gapped, secrets",
      authorId: author2.id,
      views: 318,
      copies: 76,
    },
    {
      title: "Deep Reasoning & Formal Verification of Cryptographic Flow",
      description: "Математичний та логічний аналіз криптографічних примітивів, стійкості генераторів псевдовипадкових чисел та сесій.",
      systemInstructions: "Ти — спеціаліст із математичної криптографії. Використовуй покроковий ланцюг міркувань. Досліджуй ентропію, стійкість до колізій та стійкість хеш-функцій (SHA-256 vs MD5/SHA1).",
      promptTemplate: "Проаналізуй наступну схему генерації токенів сесії:\n{{crypto_scheme}}\nПоясни вектор можливої атаки на базі колізій або передбачуваності генератора.",
      modelType: "DeepSeek",
      category: "Security",
      tags: "cryptography, formal-verification, entropy, math",
      authorId: admin.id,
      views: 450,
      copies: 122,
    },
    {
      title: "Zero-Cost TypeScript Domain Modeling & Algebraic Types",
      description: "Проектування типізованих доменних моделей без просідання швидкодії з валідацією типів під час компіляції.",
      systemInstructions: "Ти — провідний TypeScript архітектор. Використовуй строго discriminated unions, opaque/branded types, satisfies оператори та уникай any/unknown без звуження типів.",
      promptTemplate: "Спроектуй доменну модель для наступної бізнес-вимоги:\n{{requirement}}\nЗабезпеч 100% захист від некоректних станів на рівні компілятора.",
      modelType: "Claude 3.5 Sonnet",
      category: "Coding",
      tags: "typescript, domain-driven-design, types, zero-cost",
      authorId: author1.id,
      views: 289,
      copies: 73,
    },
    {
      title: "Asynchronous Concurrency & Deadlock Prevention (Node.js/Go)",
      description: "Аудит конкурентного коду на Race Conditions, deadlock та витоки ресурсів у worker-потоках.",
      systemInstructions: "Ти — інженер з високонавантажених систем. Аналізуй конкурентний доступ до спільних ресурсів, м'ютекси, черги та асинхронні операції.",
      promptTemplate: "Проаналізуй наявність стану гонитви (race condition) у наступному коді:\n```{{language}}\n{{code}}\n```\nЗапропонуй thread-safe або lock-free альтернативу.",
      modelType: "GPT-4o",
      category: "Coding",
      tags: "concurrency, async, race-condition, performance",
      authorId: author1.id,
      views: 395,
      copies: 98,
    },
    {
      title: "Architectural Decision Record (ADR) Spec Generator",
      description: "Формування чітких рішень ADR за стандартом Michael Nygard з аналізом компромісів (trade-offs).",
      systemInstructions: "Ти — Technical Writer та системний архітектор. Створюй структуровані ADR: Context, Decision, Consequences, Status, Alternatives Considered.",
      promptTemplate: "Склади Architectural Decision Record (ADR) для наступного технічного рішення:\n{{decision_context}}\nВкажи позитивні та негативні наслідки для команди.",
      modelType: "GPT-4o",
      category: "Writing",
      tags: "adr, architecture-decision, tech-writing, documentation",
      authorId: author2.id,
      views: 260,
      copies: 64,
    },
    {
      title: "API Changelog & Breaking Change Migration Guide",
      description: "Трансформація git-дифу та оновлень контракту в зрозумілий гайд міграції для сторонніх розробників.",
      systemInstructions: "Пиши документацію публічного API з фокусом на DX (Developer Experience). Виділяй Breaking Changes, додавай приклади Before/After.",
      promptTemplate: "Склади релізний чейнджлог та інструкцію міграції для наступних змін у контракті API:\n```json\n{{api_changes}}\n```",
      modelType: "Claude 3.5 Sonnet",
      category: "Writing",
      tags: "api, changelog, migration-guide, breaking-changes",
      authorId: author1.id,
      views: 310,
      copies: 81,
    },
    {
      title: "Multi-Agent Orchestrator & Workflow State Coordinator",
      description: "Системний контракт для супервізора мультиагентних пайплайнів із передачею контексту та валідацією проміжних кроків.",
      systemInstructions: "Ти — агент-координатор (Supervisor). Твоя роль — декомпозувати завдання на підзадачі, делегувати спеціалізованим субагентам та синтезувати фінальну відповідь.",
      promptTemplate: "Розподіли виконання наступної складної задачі між субагентами:\n{{task_description}}\nОпиши вхідні та вихідні контракти для кожного етапу.",
      modelType: "GPT-4o",
      category: "System",
      tags: "multi-agent, orchestrator, state-machine, system-design",
      authorId: admin.id,
      views: 520,
      copies: 145,
    },
  ];

  for (const p of promptsData) {
    const created = await prisma.prompt.create({ data: p });
    // Add sample rating
    await prisma.rating.create({
      data: {
        score: 5,
        comment: "Чудовий промпт, допоміг знайти критичні баги на проєкті!",
        promptId: created.id,
        userId: author1.id,
      },
    });
  }

  console.log("Database seeded successfully with 3 users and 6 prompts!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
