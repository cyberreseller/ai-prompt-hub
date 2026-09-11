# 🚀 AI Prompt & Tool Hub (MVP)
### *The Architectural Benchmark for AI Engineering, LLM Prompts & AppSec Benchmarks*

[![Next.js](https://img.shields.io/badge/Next.js-14.2.15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.21-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Security](https://img.shields.io/badge/OWASP-LLM_Top_10_%26_ASVS-emerald?style=for-the-badge&logo=shield)](https://owasp.org/)

Платформа-маркетплейс та інтерактивна лабораторія системних інструкцій, інженерних промптів і контрактів безпеки для провідних моделей штучного інтелекту (**LLM**). 

Розроблено як повнофункціональний **MVP** з акцентом на сучасні мовні моделі («елемки»), тестування промптів із динамічними змінними та відповідність стандартам **OWASP Top 10 for LLMs** і **OWASP ASVS**.

---

## 🌟 Ключові можливості платформи

### 1. 🧪 Інтерактивний LLM Playground & Model Arena
- **Підтримка 5 провідних LLM-рушіїв:**
  - `Claude 3.5 Sonnet` (Anthropic) — еталон для AppSec аудиту та рефакторингу коду.
  - `GPT-4o` (OpenAI) — швидкісна мультимодальна генерація та CI/CD пайплайни.
  - `Gemini 1.5 Pro` (Google DeepMind) — гігантський контекст до 2,000,000 токенів.
  - `DeepSeek V3 / R1` (DeepSeek) — ланцюги глибоких міркувань (`<think>`) та перевірка математичної криптографії.
  - `Llama 3.3 70B` (Meta Open Weights) — приватний локальний аудит без передачі даних на зовнішні сервери.
- **Динамічна інжекція змінних шаблону (`{{variables}}`):**
  - Автоматичний парсинг плейсхолдерів (`{{language}}`, `{{code}}`, `{{plan}}`, `{{tools}}` тощо).
  - Генерація динамічних полів введення для кожної змінної.
  - Кнопка *«Заповнити демо-значеннями»* для миттєвого тестування.
  - **Live Compiled Preview:** миттєве компілювання фінального промпту в реальному часі.
- **Гіперпараметри та аналітика запиту:**
  - Регулювання `Temperature` (0.00 – 1.00) та `Max Output Tokens` (256 – 4096).
  - Підрахунок токенів у реальному часі (*Prompt Tokens*, *Completion Tokens*, *Total Tokens*).
  - Оцінка часу відгуку (*Latency ms*) та вартості генерації (*Estimated Cost $*).

---

### 2. 🤖 Реєстр та Матриця Моделей (Model Hub)
- Порівняльна таблиця характеристик сучасних моделей:
  - Розмір контекстного вікна (від 64k до 2M токенів).
  - Тарифікація за 1M вхідних та вихідних токенів.
  - Рейтинг швидкодії (*Ultra Fast*, *Fast*, *Balanced*, *Deep Reasoning*).
  - Архітектурні рекомендації та ключові переваги.
- Прямий перехід у Playground або фільтрація каталогу за обраною моделлю в один клік.

---

### 3. 🛡️ AI Safety & AppSec Benchmark
- Практичне керівництво за стандартом **OWASP Top 10 for LLM Applications**:
  - `LLM01`: Prompt Injection & Jailbreak Defense (розмежування System і User контекстів).
  - `LLM02`: Insecure Output Handling (захист від виконання довільного коду та XSS).
  - `LLM06`: Sensitive Information Disclosure (захист від витоку системних інструкцій та секретів).
  - `LLM08`: Excessive Agency & Unbounded Tools (принцип найменших привілеїв для AI-агентів).
- Архітектурний чеклист для створення безпечних системних промптів.

---

### 4. 💻 Експорт коду для розробників
Модальне вікно миттєвої генерації коду інтеграції для обраного промпту:
- **Python SDK:** готова інтеграція з бібліотеками `anthropic`, `openai` або `google.generativeai`.
- **cURL / Bash:** готовий запит для терміналу або CI/CD автоматизації.
- **LangChain:** `ChatPromptTemplate.from_messages()` для створення ланцюжків і агентів.
- **JSON Schema:** стандартизована специфікація промпту.

---

### 5. 🎨 Преміальний дизайн та UX
- **Double-Bezel Hardware Architecture:** апаратні картки з прецизійним внутрішнім обрамленням і бліками.
- **Плаваючий острівець навігації:** ергономічне перемикання між Каталогом, Playground, Реєстром моделей та Безпекою.
- **Система «Обране» (Favorites):** збереження обраних промптів із персистентністю через `localStorage`.
- **Розумне сортування та пошук:** фільтрація за рейтингом, кількістю копіювань, переглядами та новизною.
- **Toast Notifications:** плаваючі сповіщення про копіювання та виконання операцій.

---

## 🛠️ Стек технологій

| Шар | Технологія |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router, Server & Client Components) |
| **Language** | TypeScript 5.6 |
| **Styling** | Tailwind CSS 3.4, Custom Double-Bezel System, Fluid Glassmorphism |
| **Icons** | Lucide React |
| **Database** | Prisma ORM + SQLite (`dev.db`) / PostgreSQL ready |
| **Authentication** | JWT (JSON Web Tokens) + bcryptjs (HttpOnly Cookies) |
| **Containerization** | Docker + Docker Compose |

---

## ⚡ Швидкий старт локально

### 1. Клонування репозиторію
```bash
git clone https://github.com/cyberreseller/ai-prompt-hub.git
cd ai-prompt-hub
```

### 2. Встановлення залежностей
```bash
npm install
```

### 3. Ініціалізація бази даних та наповнення даними
```bash
npx prisma db push
node prisma/seed.js
```

### 4. Запуск сервера розробки
```bash
npm run dev
```
Відкрийте браузер за адресою: **[http://localhost:3000](http://localhost:3000)**.

---

## 🐳 Запуск через Docker

```bash
docker-compose up --build
```
Додаток буде доступний на порту `3000`.

---

## 👥 Тестові облікові записи

База даних містить попередньо створених користувачів для перевірки ролей та автентифікації:

| Роль | Email / Логін | Пароль |
| :--- | :--- | :--- |
| **Адміністратор** | `admin@prompthub.io` / `admin_cyber` | `Password123!` |
| **Розробник** | `alex.dev@prompthub.io` / `alex_architect` | `Password123!` |
| **SecOps Інженер** | `olena.sec@prompthub.io` / `olena_sec` | `Password123!` |

---

## 📁 Структура проєкту

```
ai-prompt-hub/
├── app/
│   ├── api/
│   │   ├── ai/test/          # Симуляція та аналітика виконання LLM
│   │   ├── auth/             # Автентифікація (login, register, logout, me)
│   │   ├── prompts/          # CRUD промптів, фільтри, копіювання, оцінки
│   │   └── users/            # Профілі користувачів
│   ├── globals.css           # Стилі double-bezel, повзунків та анімацій
│   ├── layout.tsx            # Кореневий макет, шрифти та фоновий mesh
│   └── page.tsx              # Головний інтерфейс каталогу та модальні вікна
├── components/
│   ├── AppSecGuide.tsx       # Довідник OWASP Top 10 for LLMs та безпека
│   ├── ExportModal.tsx       # Експорт у Python, cURL, LangChain, JSON
│   ├── LlmPlayground.tsx     # Інтерактивна консоль тестування промптів
│   ├── ModelRegistry.tsx     # Матриця специфікацій та бенчмарків LLM
│   ├── Navbar.tsx            # Плаваючий острівець навігації
│   └── Toast.tsx             # Система плаваючих сповіщень
├── prisma/
│   ├── schema.prisma         # Схема даних (User, Prompt, Rating, ApiKey)
│   └── seed.js               # Скрипт початкового наповнення бази
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## 📄 Ліцензія
Розроблено для навчальних та практичних цілей у межах досліджень безпеки програмного забезпечення та AI-інженерії.
