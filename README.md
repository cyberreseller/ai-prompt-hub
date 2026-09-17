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
- Повний практичний довідник за стандартом **OWASP Top 10 for LLM Applications**:
  - `LLM01`: **Prompt Injection & Jailbreak Defense** — розмежування системного та користувацького контекстів, захист від обходу інструкцій.
  - `LLM02`: **Insecure Output Handling** — санітизація згенерованого контенту, захист від XSS та виконання довільного коду (RCE).
  - `LLM03`: **Training Data Poisoning** — верифікація джерел знань та захист векторних баз (RAG) від спотворених ембедінгів.
  - `LLM04`: **Model Denial of Service (DoS)** — лімітування `max_tokens`, rate limiting за IP та токенами для запобігання перевантаженню.
  - `LLM05`: **Supply Chain Vulnerabilities** — аудит сторонніх плагінів, бібліотек та перевірка моделей із відкритих джерел.
  - `LLM06`: **Sensitive Information Disclosure** — блокування спроб витоку системних інструкцій, секретів, API-ключів та PII.
  - `LLM07`: **Insecure Plugin / Extension Design** — сувора валідація схем вхідних аргументів і розмежування прав доступу інструментів.
  - `LLM08`: **Excessive Agency & Unbounded Tools** — принцип найменших привілеїв та обов'язковий Human-in-the-Loop для критичних дій.
  - `LLM09`: **Overreliance** — автоматичні пайплайни перевірки, лінтери, SAST та верифікація згенерованого коду розробником.
  - `LLM10`: **Model Theft & Exfiltration** — захист точок доступу до API, моніторинг аномальних обсягів запитів та шифрування артефактів.
- Архітектурний чеклист для створення безпечних системних промптів.

---

### 4. 💻 Експорт коду для розробників
Модальне вікно миттєвої генерації коду інтеграції для обраного промпту:
- **Python SDK:** готова інтеграція з бібліотеками `anthropic`, `openai` або `google.generativeai`.
- **cURL / Bash:** готовий запит для терміналу або CI/CD автоматизації.
- **LangChain:** `ChatPromptTemplate.from_messages()` для створення ланцюжків і агентів.
- **JSON Schema:** стандартизована специфікація промпту.

---

### 5. 🎨 Преміальний дизайн та розширений UX
- **Double-Bezel Hardware Architecture:** апаратні картки з прецизійним внутрішнім обрамленням, напівпрозорим гласморфізмом і неоновими бліками.
- **Плаваючий острівець навігації:** ергономічне швидке перемикання між Каталогом, Playground, Реєстром моделей та Центром Безпеки.
- **Інтерактивна пісочниця Hero Sandbox:** живий прев'ю-термінал на головному екрані з перемиканням режимів (*Security Audit*, *Clean Architecture*, *Agent Contracts*) і швидким копіюванням шаблону.
- **Повний життєвий цикл промптів (CRUD):** створення нових шаблонів, а також **редагування та видалення** власних промптів із модальним вікном підтвердження.
- **Система оцінювання та відгуків:** виставлення рейтингів (1–5 зірок) із текстовими відгуками та захистом від оцінювання власних робіт.
- **Система «Обране» (Favorites):** збереження обраних промптів із персистентністю через `localStorage` та швидка фільтрація каталогу.
- **Skeleton Shimmer Loading:** плавна анімація завантаження карток без стрибків інтерфейсу під час очікування відповіді сервера.
- **Кастомні сторінки та a11y:** брендова сторінка 404 (`not-found.tsx`), власна векторна SVG-іконка (`icon.svg`) та оптимізована доступність.
- **Розумне сортування та пошук:** фільтрація за категоріями, моделями, рейтингом, копіюваннями, переглядами та датою створення.
- **Toast Notifications:** плаваючі сповіщення про копіювання, додавання в обране та виконання дій.

---

## 🛠️ Стек технологій

| Шар | Технологія |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router, Server & Client Components) |
| **Language** | TypeScript 5.6 |
| **Styling** | Tailwind CSS 3.4, Custom Double-Bezel System, Fluid Glassmorphism |
| **Icons** | Lucide React |
| **Database** | Prisma ORM + SQLite (`dev.db`) |
| **Authentication** | JWT (JSON Web Tokens) + bcryptjs (HttpOnly Cookies) |
| **Containerization** | Docker + Docker Compose |

---

## ⚡ Швидкий старт локально

### Варіант А: В один клік під Windows
У каталозі проєкту наявний готовий скрипт:
```cmd
run.bat
```
Він автоматично запустить сервер розробки на [http://localhost:3000](http://localhost:3000).

---

### Варіант Б: Запуск через термінал

#### 1. Клонування репозиторію
```bash
git clone https://github.com/cyberreseller/ai-prompt-hub.git
cd ai-prompt-hub
```

#### 2. Встановлення залежностей
```bash
npm install
```

#### 3. Налаштування середовища
Файл `.env` вже попередньо налаштований для локального запуску (шаблон — `.env.example`):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-jwt-key-never-share"
PORT=3000
NODE_ENV="development"
```

#### 4. Ініціалізація бази даних та наповнення даними
```bash
npx prisma db push
node prisma/seed.js
```

#### 5. Запуск сервера розробки
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
│   ├── icon.svg              # Фірмова векторна піктограма застосунку
│   ├── layout.tsx            # Кореневий макет, шрифти та фоновий mesh
│   ├── not-found.tsx         # Кастомна сторінка 404 у стилі double-bezel
│   └── page.tsx              # Головний інтерфейс каталогу, фільтри та модальні вікна
├── components/
│   ├── AppSecGuide.tsx       # Довідник усіх 10 стандартів OWASP Top 10 for LLMs
│   ├── ExportModal.tsx       # Експорт у Python, cURL, LangChain, JSON
│   ├── LlmPlayground.tsx     # Інтерактивна консоль тестування промптів
│   ├── ModelRegistry.tsx     # Матриця специфікацій та бенчмарків LLM
│   ├── Navbar.tsx            # Плаваючий острівець навігації
│   └── Toast.tsx             # Система плаваючих сповіщень
├── lib/
│   ├── auth.ts               # Утиліти сесії та верифікації користувача
│   ├── jwt.ts                # Підпис і перевірка валідності токенів JWT
│   ├── legacy-crypto.ts      # Криптографічні модулі
│   └── prisma.ts             # Синглтон PrismaClient для роботи з SQLite
├── prisma/
│   ├── schema.prisma         # Схема даних (User, Prompt, Rating, ApiKey)
│   └── seed.js               # Скрипт початкового наповнення бази
├── .env.example              # Шаблон конфігурації змінних оточення
├── Dockerfile                # Багатоетапний Docker-образ (Alpine Linux)
├── docker-compose.yml        # Конфігурація для запуску в контейнері
├── package.json              # Залежності та скрипти проєкту
└── run.bat                   # Швидкий запуск під Windows в один клік
```

---

## 📄 Ліцензія
Розроблено для навчальних та практичних цілей у межах досліджень безпеки програмного забезпечення та AI-інженерії.
