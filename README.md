# 🚀 LearnLynk Task Management

### **Full-stack implementation using Supabase, Edge Functions, Next.js, React Query & TailwindCSS**

> “A fully functional, clean, and modern full-stack application demonstrating database design, secure access rules, serverless functions, and a responsive frontend dashboard.”

<br/>

![Supabase](https://img.shields.io/badge/Supabase-%23000000.svg?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Next JS](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-%23139AFF.svg?style=for-the-badge&logo=tailwindcss)
![React Query](https://img.shields.io/badge/React%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)

</div>

---

## ✨ Overview

This project is a **feature-complete task management mini-application** built on top of **Supabase** and **Next.js**.  
It includes:

- 🔸 Supabase SQL schema & triggers
- 🔸 Row-Level Security policies
- 🔸 A TypeScript Edge Function for task creation
- 🔸 A modern Next.js dashboard
- 🔸 Task completion workflow with React Query
- 🔸 TailwindCSS for clean UI

> “The project reflects real-world structure — backend, serverless logic, and frontend UI working together seamlessly.”

---

## 📂 Directory Structure

```bash
learnlynk-assignment/
│
├── supabase/
│ ├── migrations/
│ │ └── 001_schema.sql
│ ├── policies/
│ │ └── leads_policies.sql
│ └── functions/
│   └── create-task/
│     ├── index.ts
│     └── deno.json
│
└── frontend/
├── app/
│ ├── layout.tsx
│ ├── globals.css
│ └── dashboard/
│   └── today/page.tsx
├── lib/supabaseClient.ts
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

# 🧩 **Supabase Backend**

## 🗄️ Database Schema

Located in: `supabase/migrations/001_schema.sql`

Includes:

- `leads`, `applications`, `tasks`
- Foreign key relations
- `type` check constraints
- Due date validation (`due_at >= created_at`)
- Auto-updated timestamps
- Indexes for performance

> “Designed with real-world relational logic and optimized for frequent dashboard queries.”

---

## 🔐 Row-Level Security (RLS)

Located in: `supabase/policies/leads_policies.sql`

### ✔ RLS Rules Implemented:

- Admins → full access
- Counselors →
  - Leads they own
  - Leads in their teams
- Tenant isolation ensured
- Secure INSERT policies

> “Access is granted only when identity, team membership, and tenant match — ensuring multi-tenant security.”

---

# ⚡ **Edge Function — Task Creation**

Path: `supabase/functions/create-task/index.ts`

### ✔ Capabilities:

- Parses JSON POST body
- Validates task type
- Validates due date is in the future
- Inserts new task using Supabase Service Role
- Returns success JSON
- Handles 400 and 500 errors properly

> “Serverless logic allowing secure task creation from any client or backend workflow.”

---

# 🖥️ **Next.js Dashboard — `/dashboard/today`**

Path: `frontend/app/dashboard/today/page.tsx`

### Features:

| Feature                   | Status |
| ------------------------- | ------ |
| Fetch tasks due today     | ✅     |
| Display task details      | ✅     |
| Mark task complete        | ✅     |
| React Query cache updates | ✅     |
| TailwindCSS UI            | ✅     |
| Error & loading states    | ✅     |

> “A clean and responsive UI powered by React Query for smooth client-side state management.”

---

# ▶️ **How to Run**

### 📌 Start Supabase

```bash
npx supabase start
```

### 📌 Apply schema & policies

```bash


npx supabase db reset

```

### 📌 Deploy Edge Function

```bash
npx supabase link --project-ref <PROJECT_REF>
npx supabase functions deploy create-task

```

### 📌 Run Frontend

```bash

cd frontend
npm install
npm run dev


```

### 👉 Visit:

```bash
 http://localhost:3000/dashboard/today

```

### Task 5 — Stripe Checkout (Written Answer)

- To implement Stripe Checkout for an application fee, I would first create a backend endpoint that initializes a stripe.checkout.sessions.create() call with the amount, currency, and the application_id stored in the session metadata. Before redirecting the user to Stripe, I would insert a new payment_request row in the database with status = 'pending' and store the Stripe session_id for tracking.
- After the user completes the payment, Stripe sends a checkout.session.completed webhook event to my backend.
- In the webhook handler, I would verify the event signature, fetch the session details, and update the corresponding payment_request record to status = 'paid'.
- I would then update the related application’s payment status, move the application to the next stage (e.g., “Payment Received”), and optionally write an entry into an application timeline or activity log.
- All webhook operations would be idempotent to avoid double-processing. This ensures the entire payment flow remains secure, traceable, and synchronized with application progress.

### Assumptions made

- I assumed that tenant-level isolation is required across all tables, so each table includes a tenant_id field.

- The RLS policies assume the existence of users, teams, and user_teams tables with fields typically available in multi-tenant systems.

- JWT payload is assumed to contain user_id, tenant_id, and role, as commonly seen in Supabase auth implementations.

- The Edge Function uses the Service Role key, assuming server-side trusted execution.

- For simplicity, the frontend does not implement user authentication — it focuses only on task fetching and updating functionality.

- The dashboard shows tasks due today based on the user’s system timezone.

- I assumed that marking a task “completed” does not require additional backend validation beyond updating the status field.

- UI is intentionally minimal but clean, focused on meeting functional requirements while remaining readable and maintainable.

- All components and pages follow the Next.js App Router structure (not Pages Router).

- Error and loading states are handled with React Query for reliability and clean state transitions.

## 🙌 Thank You

This project demonstrates full-stack development skills across database design, backend logic, secure access, serverless functions, and frontend state management.  
If you have any questions, I’m happy to walk through the code or architecture.
