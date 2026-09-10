# 🚀 AI Prompt & Tool Hub

Платформа-маркетплейс промптів, системних інструкцій та інструментів для штучного інтелекту.
Проєкт розроблено в межах курсу **«Безпека програмного забезпечення»** (НУ «Львівська політехніка», Кафедра захисту інформації) за **Шляхом 1** (власний застосунок).

---

## 🛠️ Стек технологій
- **Full-stack:** Next.js 14 (App Router, TypeScript, React 18)
- **Стилізація:** Tailwind CSS, Lucide Icons, Bento-grid Layout
- **База даних:** Prisma ORM + SQLite (локально) / PostgreSQL (Vercel/Cloud)
- **Автентифікація:** JWT (JSON Web Tokens) + bcryptjs
- **Контейнеризація:** Docker + Docker Compose

---

## ⚡ Швидкий старт локально

1. **Встановлення залежностей:**
   ```bash
   npm install
   ```

2. **Ініціалізація бази даних SQLite:**
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

3. **Запуск сервера розробки:**
   ```bash
   npm run dev
   ```
   Відкрийте браузер за адресою [http://localhost:3000](http://localhost:3000).

---

## 🛡️ Лабораторне середовище та тестові користувачі:

### Тестові користувачі (створені через seed.js):
- **Адміністратор:** `admin@prompthub.local` / Пароль: `Password123!`
- **Розробник:** `alex.dev@prompthub.local` / Пароль: `Password123!`
- **SecOps:** `olena.sec@prompthub.local` / Пароль: `Password123!`
