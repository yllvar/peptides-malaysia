# Peptides Malaysia - Evo™

<div align="center">
<img width="1200" height="475" alt="Peptides Malaysia Evo Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

**Peptides Malaysia - Evo™** is a premium e-commerce platform for research peptides in Malaysia. Built with React (Vite), Tailwind CSS 4, and powered by Vercel Serverless Functions + Neon Postgres.

---

## 📚 Documentation

We maintain comprehensive documentation for developers, architects, and testers.

- **[📖 Documentation Index](./docs/README.md)** - Start here!
- **[🏗️ System Architecture](./docs/architecture/SYSTEM_OVERVIEW.md)** - Tech stack & high-level design.
- **[🔌 API Reference](./docs/api/ENDPOINTS.md)** - Endpoints, Authentication, and Schemas.
- **[📊 Database Schema](./docs/database/SCHEMA.md)** - Data models & relationships.
- **[🧪 Testing Strategy](./docs/testing/TEST_STRATEGY.md)** - How to run and write tests.
- **[🚀 Deployment Guide](./docs/deployment/VERCEL_GUIDE.md)** - Production setup instructions.

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js 20+
- NPM
- A local `.env` file (copied from `.env.example` if available, or ask the team).

### 2. Installation
```bash
npm install
```

### 3. Database Setup (Dev)
Ensure your `.env` has a valid `DATABASE_URL`.
```bash
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Tests
```bash
npm run test
```

---

## 🛠️ Project Structure

```plaintext
/
├── api/                # Backend API Routes (Vercel Functions)
├── src/                # Frontend React application
├── prisma/             # Database Schema & Migrations
├── public/             # Static Assets
├── __tests__/          # Vitest Test Suites
└── docs/               # Project Documentation
```

---

## 📜 License
Private & Confidential.
