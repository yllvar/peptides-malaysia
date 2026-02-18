# Documentation Index

Welcome to the **Peptides Malaysia - Evo™** documentation. This knowledge base is designed to support continuous contextual development by providing clear, up-to-date, and comprehensive information about the project's architecture, APIs, database, and testing strategies.

## 📚 Core Documentation

### [Architecture](./architecture/SYSTEM_OVERVIEW.md)
Understanding the high-level system design, technology stack, and component interactions.
- **[Frontend Architecture](./architecture/FRONTEND.md)**: Visuals, state (Zustand), and styling.
- **Key Backend Patterns:** Vercel Serverless Functions, Neon Postgres + Prisma, JWT Authentication.

### [API Reference](./api/ENDPOINTS.md)
Detailed documentation of all backend API endpoints, including request/response schemas and authentication requirements.
- **Public:** Products, Blogs
- **Protected:** Orders, User Profile
- **Admin:** Management APIs

### [Database Schema](./database/SCHEMA.md)
Explanation of the data model, entity relationships, and design decisions.
- **Prisma Schema:** Models, Enums, and Relations.

### [Testing Strategy](./testing/TEST_STRATEGY.md)
Guidelines for writing and running tests, coverage reports, and specific implementation plans.
- **Unit Tests:** API endpoints, Utility logic.
- **Integration Tests:** (Planned)
- **Gap Analysis:** Current test coverage status.

### [Integrity Loop](./workflows/INTEGRITY_LOOP.md)
The core development workflow protocol, ensuring code quality and consistency.


### [Deployment Guide](./deployment/VERCEL_GUIDE.md)
Instructions for deploying the application to production, managing environment variables, and performing database migrations.

---

## 🛠️ User & Admin Guides

### [Content Management](./guides/CONTENT_MANAGEMENT.md)
Instructions for the site owner on how to manage products, blogs, and technical reports.

### [WhatsApp Bot Prompt](./guides/WHATSAPP_BOT_PROMPT.md)
System instruction copy for the Python/Gemini WhatsApp bot, including persona, safety guidelines, and product knowledge.


### [Troubleshooting](./guides/TROUBLESHOOTING.md)
Common errors, database connection issues, and frontend styling fixes.

---

## 📅 Roadmap & Planning

### [Backend Plan (2026-02-11)](./roadmap/BACKEND_PLAN_2026_02_11.md)
The original architectural roadmap and implementation plan for transforming the static site into a full-stack application.

---

## 📜 Historical Audits

### [Context Audit (2026-02-11)](./CONTEXT_AUDIT_2026_02_11.md)
A comprehensive audit of the production readiness and architecture as of Feb 11, 2026.

---

## 🛠️ Developer Guide

### Prerequisites
- Node.js (Latest LTS)
- NPM
- A local `.env` file (see `.env.example`)

### Quick Start
```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

# Run tests
npm run test
```
