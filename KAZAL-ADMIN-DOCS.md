# Kazal Admin Panel — Complete Documentation

**Stack**: Next.js 14+ (App Router) · Supabase (PostgreSQL) · Drizzle ORM · Tailwind UI + shadcn/ui  
**Mobile App**: Prime Capital Advisory (React Native / Expo)  
**Goal**: Full admin panel to manage all app content + chat replies without changing the mobile app UI.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Mobile App Data Map](#2-mobile-app-data-map)
3. [Database Schema (Drizzle ORM)](#3-database-schema-drizzle-orm)
4. [Supabase Setup](#4-supabase-setup)
5. [Next.js Admin Panel Structure](#5-nextjs-admin-panel-structure)
6. [Admin Panel Pages — Complete Spec](#6-admin-panel-pages--complete-spec)
   - 6.1 Login
   - 6.2 Dashboard
   - 6.3 Services Manager (with Hierarchy & Related)
   - 6.4 Opportunities Manager
   - 6.5 Chat Manager (with Admin Replies)
   - 6.6 App Content Manager
   - 6.7 Admin Users
7. [Service Hierarchy System](#7-service-hierarchy-system)
8. [Chat Realtime Flow](#8-chat-realtime-flow)
9. [Mobile App Integration](#9-mobile-app-integration)
10. [RLS Policies](#10-rls-policies)
11. [Implementation Roadmap](#11-implementation-roadmap)
12. [Sample Code](#12-sample-code)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN WEB PANEL                              │
│  Next.js + Drizzle ORM + shadcn/ui + Tailwind UI                │
│                                                                  │
│  ┌───────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────┐   │
│  │ Services  │  │ Opportunities│  │   Chat   │  │  Content  │   │
│  │ CRUD +    │  │ CRUD + Filter│  │ Reply to │  │  Manager  │   │
│  │ Hierarchy │  │ + Link to    │  │ Users    │  │  (Profile │   │
│  │ + Related │  │   Service    │  │ Realtime │  │  Company) │   │
│  └─────┬─────┘  └──────┬───────┘  └────┬─────┘  └─────┬─────┘   │
│        └───────────────┴───────────────┴───────────────┘         │
│                                │                                  │
│                    ┌───────────▼───────────┐                      │
│                    │      Supabase          │                      │
│                    │  ┌──────────────────┐  │                      │
│                    │  │   PostgreSQL     │  │                      │
│                    │  │ + Row Level Sec. │  │                      │
│                    │  │ + Realtime       │  │                      │
│                    │  │ + Storage (files)│  │                      │
│                    │  │ + Auth           │  │                      │
│                    │  └──────────────────┘  │                      │
│                    └───────────┬───────────┘                      │
└────────────────────────────────┼──────────────────────────────────┘
                                 │
                                 │ (Supabase Client + Realtime)
                                 │
                    ┌────────────▼────────────┐
                    │     MOBILE APP           │
                    │     (React Native)       │
                    │                          │
                    │  fetchServices() ◄────────┤
                    │  fetchOpportunities() ◄───┤
                    │  Realtime msg ◄───────────┤
                    │  sendMessage() ──────────►│
                    │                          │
                    │  UI: UNCHANGED            │
                    └──────────────────────────┘
```

---

## 2. Mobile App Data Map

Before building the admin panel, understand exactly what data the mobile app consumes.

### 2.1 Services (`src/types/service.ts`)

```ts
type Service = {
  id: string;
  title: string;          // "Letter of Credit"
  summary: string;         // "Secure trade transactions..."
  icon: { set: 'ion' | 'mci'; name: string };  // { set: 'ion', name: 'document-text-outline' }
  description: string;     // Full paragraph
  features: string[];      // ["Bank-guaranteed payment security", "Sight & usance terms", ...]
};
```

**Used in**: `services.tsx` (list), `service/[id].tsx` (detail), `mock.ts`

### 2.2 Service Detail Page (`service/[id].tsx`)

- Header: icon + title
- Description paragraph
- **Key Highlights**: features list with checkmarks
- **Related Opportunities**: filtered by keyword match on title
- CTAs: "Inquire Now", "Chat About This"

### 2.3 Opportunities (`src/types/opportunity.ts`)

```ts
type Opportunity = {
  id: string;
  tag: 'LC' | 'Bonds' | 'BG' | 'Loans';
  title: string;            // "Standby LC – EUR 2M"
  amount: string;           // "EUR 2,000,000"
  instrument: string;       // "Standby LC"
  provider: string;         // "HSBC Bank – UAE"
  issuingBank: string;      // "HSBC Bank"
  country: string;          // "UAE"
  metric?: { label: string; value: string };  // { label: 'Discount', value: '35%' }
  validity?: string;        // "25 May 2026"
  type?: string;            // "Standby LC"
  tenor?: string;           // "360 Days"
  status: 'Available' | 'In Discussion';
  description: string;
};
```

**Used in**: `home.tsx` (latest), `opportunities.tsx` (list + filter by tag), `opportunity/[id].tsx` (detail)

### 2.4 Chat Threads (`src/types/chat.ts`)

```ts
type ChatThread = {
  id: string;
  name: string;             // "Letter of Credit"
  desk: string;             // "Trade Finance Desk"
  preview: string;          // Last message preview
  time: string;             // "Just now"
  unread: number;           // Unread count
  online: boolean;          // Advisor online status
  context?: { type: 'service' | 'opportunity'; id: string; label: string };
};

type ChatMessage = {
  id: string;
  from: 'me' | 'advisor';  // ← Admin replies map to 'advisor'
  text?: string;
  time: string;
  image?: string;
  file?: { name: string; size: string; mimeType?: string };
  replyTo?: { text: string; from: string };
  reactions?: string[];     // ["👍", "❤️", ...]
};
```

**Used in**: `chat.tsx` (thread list), `chat/[id].tsx` (detail with full chat UI)

### 2.5 Profile / Company (`src/types/company.ts`)

```ts
type Company = {
  name: string; slogan: string; tagline: string; trust: string;
  phone: string; whatsapp: string; email: string;
  instagram: string; linkedin: string;
  address: { city: string; line: string };
};

type Profile = {
  name: string; role: string; intro: string;
  keyPoints: string[]; markets: string[];
};

type QuickAccessItem = {
  id: string; label: string;
  icon: IconRef; href: string;
};
```

**Used in**: `home.tsx` (quick access), `profile.tsx` (all profile data)

---

## 3. Database Schema (Drizzle ORM)

### 3.1 Project Init

```bash
npx create-next-app@latest kazal-admin --typescript --tailwind --app
cd kazal-admin
npm install drizzle-orm postgres dotenv
npm install -D drizzle-kit
npm install @supabase/supabase-js
npx shadcn@latest init -d
npx shadcn@latest add button card form input textarea select table dialog badge \
  tabs toast dropdown-menu separator switch toggle tooltip
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
```

### 3.2 Directory: `db/schema/`

#### `db/schema/services.ts`

```ts
import { pgTable, uuid, text, jsonb, boolean, integer, timestamp } from 'drizzle-orm/pg-core';

export const services = pgTable('services', {
  id: uuid().primaryKey().defaultRandom(),
  slug: text().unique().notNull(),
  title: text().notNull(),
  summary: text().notNull(),
  description: text().notNull(),
  iconSet: text('icon_set').notNull().default('ion'),
  iconName: text('icon_name').notNull(),
  features: jsonb().notNull().default([]),
  parentId: uuid('parent_id').references((): any => services.id),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### `db/schema/service-relations.ts`

```ts
import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { services } from './services';

export const serviceRelations = pgTable('service_relations', {
  id: uuid().primaryKey().defaultRandom(),
  serviceId: uuid('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  relatedServiceId: uuid('related_service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### `db/schema/opportunities.ts`

```ts
import { pgTable, uuid, text, jsonb, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { services } from './services';

export const opportunities = pgTable('opportunities', {
  id: uuid().primaryKey().defaultRandom(),
  slug: text().unique().notNull(),
  tag: text().notNull(),
  title: text().notNull(),
  amount: text().notNull(),
  instrument: text().notNull(),
  provider: text().notNull(),
  issuingBank: text('issuing_bank').notNull(),
  country: text().notNull(),
  metricLabel: text('metric_label'),
  metricValue: text('metric_value'),
  validity: text(),
  type: text(),
  tenor: text(),
  status: text().notNull().default('Available'),
  description: text().notNull(),
  serviceId: uuid('service_id').references(() => services.id),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### `db/schema/chat-threads.ts`

```ts
import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const chatThreads = pgTable('chat_threads', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  desk: text().notNull(),
  online: boolean().notNull().default(false),
  contextType: text('context_type'),
  contextId: text('context_id'),
  contextLabel: text('context_label'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### `db/schema/chat-messages.ts`

```ts
import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { chatThreads } from './chat-threads';

export const chatMessages = pgTable('chat_messages', {
  id: uuid().primaryKey().defaultRandom(),
  threadId: uuid('thread_id').notNull().references(() => chatThreads.id, { onDelete: 'cascade' }),
  senderType: text('sender_type').notNull(),    // 'user' | 'admin'
  senderId: uuid('sender_id'),
  text: text(),
  imageUrl: text('image_url'),
  fileName: text('file_name'),
  fileSize: text('file_size'),
  fileMime: text('file_mime'),
  replyToId: uuid('reply_to_id').references((): any => chatMessages.id),
  reactions: jsonb().default([]),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### `db/schema/app-content.ts`

```ts
import { pgTable, uuid, text, jsonb, boolean, timestamp } from 'drizzle-orm/pg-core';

export const appContent = pgTable('app_content', {
  id: uuid().primaryKey().defaultRandom(),
  section: text().unique().notNull(),
  content: jsonb().notNull(),
  isActive: boolean('is_active').notNull().default(true),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### `db/schema/admin-users.ts`

```ts
import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const adminUsers = pgTable('admin_users', {
  id: uuid().primaryKey().defaultRandom(),
  email: text().unique().notNull(),
  name: text().notNull(),
  avatarUrl: text('avatar_url'),
  role: text().notNull().default('admin'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

#### `db/schema/index.ts`

```ts
export { services } from './services';
export { serviceRelations } from './service-relations';
export { opportunities } from './opportunities';
export { chatThreads } from './chat-threads';
export { chatMessages } from './chat-messages';
export { appContent } from './app-content';
export { adminUsers } from './admin-users';
```

### 3.3 `db/index.ts`

```ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
```

### 3.4 `drizzle.config.ts`

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema/*',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

### 3.5 Run Migrations

```bash
npx drizzle-kit push    # Dev: push schema directly
npx drizzle-kit generate # Prod: generate SQL file
npx drizzle-kit migrate  # Prod: apply migrations
```

---

## 4. Supabase Setup

### 4.1 Connect Supabase Project

Get the existing project URL and anon key:
- Project URL: `https://elfjoivfgkdtnnewsswb.supabase.co`
- Use existing tables or create new ones via Drizzle

### 4.2 Enable Realtime for Chat

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_threads;
```

### 4.3 Create Storage Buckets

Via Supabase Dashboard → Storage:
- `chat-attachments` — files/images from chat messages (public)
- `admin-content` — service icons, profile avatars (public)

### 4.4 Enable Auth

Supabase Dashboard → Authentication → Settings:
- Enable Email/Password auth
- Create first admin user manually

### 4.5 Seed Initial Data

Insert all existing mock data from `src/data/mock.ts` into Supabase tables so the mobile app can start fetching from the API immediately.

---

## 5. Next.js Admin Panel Structure

```
kazal-admin/
├── app/
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # → redirect /dashboard
│   ├── login/
│   │   └── page.tsx                   # Admin login
│   ├── dashboard/
│   │   ├── layout.tsx                 # Protected layout + sidebar
│   │   ├── page.tsx                   # Stats overview
│   │   ├── services/
│   │   │   ├── page.tsx               # Service list table
│   │   │   ├── new/page.tsx           # Create service
│   │   │   └── [id]/
│   │   │       ├── page.tsx           # Edit service
│   │   │       └── children/page.tsx  # Manage child services
│   │   ├── opportunities/
│   │   │   ├── page.tsx               # Opportunity list
│   │   │   ├── new/page.tsx           # Create opportunity
│   │   │   └── [id]/page.tsx          # Edit opportunity
│   │   ├── chat/
│   │   │   ├── page.tsx               # Chat dashboard (all threads)
│   │   │   └── [id]/page.tsx          # Single thread view
│   │   ├── content/
│   │   │   └── page.tsx               # App content editor
│   │   └── admins/
│   │       └── page.tsx               # Admin user management
│   └── api/
│       ├── auth/
│       │   └── route.ts               # Auth endpoints
│       └── upload/
│           └── route.ts               # File upload
├── components/
│   ├── ui/                            # shadcn components
│   ├── layout/
│   │   ├── sidebar.tsx                # Navigation sidebar
│   │   └── dashboard-header.tsx       # Top header with user menu
│   ├── services/
│   │   ├── service-form.tsx           # Create/edit form
│   │   ├── service-list.tsx           # Data table
│   │   ├── service-tree.tsx           # Hierarchy tree view
│   │   ├── icon-picker.tsx            # Icon selector with preview
│   │   └── related-services-picker.tsx
│   ├── opportunities/
│   │   ├── opp-form.tsx               # Create/edit form
│   │   └── opp-list.tsx               # Data table
│   ├── chat/
│   │   ├── thread-list.tsx            # Left panel threads
│   │   ├── chat-window.tsx            # Right panel messages
│   │   ├── message-bubble.tsx         # Single message
│   │   └── reply-input.tsx            # Input + file upload
│   └── content/
│       ├── company-editor.tsx
│       ├── profile-editor.tsx
│       └── home-editor.tsx
├── lib/
│   ├── supabase.ts                    # Browser client
│   ├── supabase-server.ts             # Server client
│   ├── utils.ts                       # cn(), formatters
│   └── db.ts                          # Drizzle client re-export
├── db/
│   └── schema/                        # (from section 3)
├── types/
│   └── index.ts                       # Shared types
├── .env.local                         # DATABASE_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
├── drizzle.config.ts
└── tailwind.config.ts
```

---

## 6. Admin Panel Pages — Complete Spec

### 6.1 Login Page (`/login`)

**File**: `app/login/page.tsx`

| Element | Detail |
|---|---|
| Layout | Centered card on dark gradient background (match app theme) |
| Form | Email + Password inputs (shadcn) |
| Auth | `supabase.auth.signInWithPassword()` |
| Error | Toast on invalid credentials |
| Success | Redirect to `/dashboard` via `router.push()` |
| Session | `createServerComponentClient()` checks session in layout |

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { /* toast error */ setLoading(false); return; }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05080F]">
      <Card className="w-96">
        <CardHeader><CardTitle>Kazal Admin</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button onClick={handleLogin} disabled={loading} className="w-full">Sign In</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 6.2 Dashboard (`/dashboard`)

**File**: `app/dashboard/page.tsx`

```tsx
import { db } from '@/lib/db';
import { services, opportunities, chatMessages, chatThreads } from '@/db/schema';
import { count, sql, and, eq } from 'drizzle-orm';
import { StatsCard } from '@/components/dashboard/stats-card';

async function getStats() {
  const [svcCount] = await db.select({ count: count() }).from(services).where(eq(services.isActive, true));
  const [oppCount] = await db.select({ count: count() }).from(opportunities).where(eq(opportunities.isActive, true));
  const [chatCount] = await db.select({ count: count() }).from(chatThreads);
  const today = new Date(); today.setHours(0,0,0,0);
  const [msgToday] = await db.select({ count: count() }).from(chatMessages)
    .where(sql`created_at >= ${today.toISOString()}`);
  return { services: svcCount.count, opportunities: oppCount.count, threads: chatCount.count, messagesToday: msgToday.count };
}
```

Display in 4 stat cards + recent activity list.

### 6.3 Services Manager — **Core Feature**

#### List Page (`/dashboard/services`)

```
┌───────┬──────────────┬────────────┬───────────┬──────────┬──────┐
│ Title │ Slug         │ Parent     │ Children  │ Status   │ Edit │
├───────┼──────────────┼────────────┼───────────┼──────────┼──────┤
│ LC    │ letter-of-cr │ —          │ Sight LC, │ 🟢 On    │ ✏️   │
│       │              │            │ Usance LC │          │      │
├───────┼──────────────┼────────────┼───────────┼──────────┼──────┤
│ Sight │ sight-lc     │ LC         │ —         │ 🟢 On    │ ✏️   │
│ LC    │              │            │           │          │      │
└───────┴──────────────┴────────────┴───────────┴──────────┴──────┘
```

**Features**:
- Search by title
- Filter by active/inactive
- Toggle active status inline
- "Add Service" button → `/dashboard/services/new`
- Row click → `/dashboard/services/[id]`

#### Create/Edit Form (`/dashboard/services/new` and `/dashboard/services/[id]`)

```
┌──────────────────────────────────────────────┐
│  Service Form                                 │
│                                               │
│  Title:        [________________________]     │
│  Slug:         [auto-generated________]       │
│  Summary:      [________________________]     │
│               [________________________]      │
│                                               │
│  Description:  [________________________]     │
│               [________________________]      │
│               [________________________]      │
│                                               │
│  Icon Set:     [Select: ion / mci]            │
│  Icon Name:    [document-text-outline]  [🔍]  │
│                                               │
│  Features:                                    │
│   [Bank-guaranteed payment security] [×]      │
│   [Sight & usance terms           ] [×]       │
│   [+ Add Feature]                             │
│                                               │
│  Parent Service: [Select: None / LC / BG ...] │
│                                               │
│  Related Services:                            │
│   ☐ Letter of Credit                          │
│   ☑ Bank Guarantee                            │
│   ☐ Standby LC                                │
│   ☐ Commercial Loans                          │
│                                               │
│  Sort Order:   [0]                            │
│  Active:       [🟢]                           │
│                                               │
│  [Cancel]  [Save Service]                     │
└──────────────────────────────────────────────┘
```

**Form logic (`service-form.tsx`)**:
- `slug` auto-generated from title using `title.toLowerCase().replace(/\\s+/g, '-')`
- Features: dynamic array of inputs with add/remove buttons
- `parentId`: dropdown of all services (excluding self and descendants)
- Related services: checkbox list of all services (excluding self)
- Icon preview: render the icon in real-time as user types the name

**Server Action**:

```ts
'use server';
import { db } from '@/lib/db';
import { services } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function createService(data: {
  title: string; slug: string; summary: string;
  description: string; iconSet: string; iconName: string;
  features: string[]; parentId?: string; relatedIds?: string[];
  sortOrder: number; isActive: boolean;
}) {
  const [svc] = await db.insert(services).values({
    title: data.title, slug: data.slug, summary: data.summary,
    description: data.description, iconSet: data.iconSet, iconName: data.iconName,
    features: JSON.stringify(data.features), parentId: data.parentId || null,
    sortOrder: data.sortOrder, isActive: data.isActive,
  }).returning();
  // Insert related services
  if (data.relatedIds?.length) {
    await db.insert(serviceRelations).values(
      data.relatedIds.map(rid => ({ serviceId: svc.id, relatedServiceId: rid }))
    );
  }
  revalidatePath('/dashboard/services');
}
```

#### Child Services Page (`/dashboard/services/[id]/children`)

Shows a nested table of all services where `parentId = [id]`:
- Quick "Add Child Service" button → pre-fills parent in create form
- Reorder with drag-and-drop to update sort_order

#### Service Tree View (`service-tree.tsx`)

Visual tree rendering the full hierarchy:

```
📂 Letter of Credit
   ├── 📂 Sight LC
   ├── 📂 Usance LC
   └── 📂 Standby LC
📂 Bank Guarantee
   ├── 📂 Bid Bond
   └── 📂 Performance Bond
📂 Government Bonds
📂 Commercial Loans
...
```

### 6.4 Opportunities Manager

#### List Page (`/dashboard/opportunities`)

```
┌──────┬──────────────┬────────────┬──────────────┬─────────┬──────────┬──────┐
│ Tag  │ Title        │ Amount     │ Provider     │ Status  │ Service  │ Edit │
├──────┼──────────────┼────────────┼──────────────┼─────────┼──────────┼──────┤
│  LC  │ Standby LC   │ EUR 2,000K│ HSBC – UAE   │ 🟢 Avail│ Standby  │ ✏️   │
│ Bonds│ Gov Bond     │ USD 10,000K│ US Treasury  │ 🟢 Avail│ Gov Bond │ ✏️   │
│  BG  │ Bank Guaran. │ USD 3,000K│ Emirates NBD │ 🟡 Disc.│ BG       │ ✏️   │
└──────┴──────────────┴────────────┴──────────────┴─────────┴──────────┴──────┘
```

**Features**:
- Filter tabs: All / LC / Bonds / BG / Loans (same as mobile app)
- Search, toggle active, inline status toggle

#### Create/Edit Form

Same fields as `Opportunity` type + service link dropdown.

### 6.5 Chat Manager — **Admin Replies**

#### Layout (`/dashboard/chat`)

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔍 Search threads...                                                │
├───────────────────┬─────────────────────────────────────────────────┤
│  THREADS          │  CHAT                                            │
│                   │                                                  │
│  🟢 LC Desk      │  ┌──────────────────────────────────────────┐    │
│  "Thank you…"     │  │  User: Hi, interested in your LC...     │    │
│  10:30 AM   [1]   │  │  Admin: Of course! We offer...          │    │
│                   │  │  User: Great, what are the rates?       │    │
│  🔴 BG Desk       │  └──────────────────────────────────────────┘    │
│  "We can help…"   │                                                  │
│  Yesterday        │  ╔══════════════════════════════════════════╗    │
│                   │  ║  Type your reply...           📎  ➤     ║    │
│  🔴 Loans Desk    │  ╚══════════════════════════════════════════╝    │
│  "Looking for…"   │                                                  │
│  2:15 PM    [2]   │                                                  │
└───────────────────┴──────────────────────────────────────────────────┘
```

#### Thread List (Left Panel) — `thread-list.tsx`

```tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ChatThread } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function ThreadList({ activeId, onSelect }: {
  activeId?: string; onSelect: (id: string) => void;
}) {
  const [threads, setThreads] = useState<ChatThread[]>([]);

  useEffect(() => {
    // Fetch initial threads
    supabase.from('chat_threads').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setThreads(data ?? []));

    // Subscribe to new messages for preview updates
    const channel = supabase
      .channel('thread-updates')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          // Update preview for the thread
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <ScrollArea className="h-full">
      {threads.map(t => (
        <div key={t.id}
          onClick={() => onSelect(t.id)}
          className={cn('p-4 border-b cursor-pointer hover:bg-muted/50',
            activeId === t.id && 'bg-muted'
          )}
        >
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', t.online ? 'bg-green-500' : 'bg-gray-400')} />
            <span className="font-medium">{t.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">{t.time}</span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{t.preview}</p>
        </div>
      ))}
    </ScrollArea>
  );
}
```

#### Chat Window (Right Panel) — `chat-window.tsx`

```tsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageBubble } from './message-bubble';
import { ReplyInput } from './reply-input';

export function ChatWindow({ threadId }: { threadId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch existing messages
    supabase.from('chat_messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })
      .then(({ data }) => setMessages(data ?? []));

    // Realtime: subscribe to new messages
    const channel = supabase
      .channel(`thread-${threadId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages',
          filter: `thread_id=eq.${threadId}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
          setTimeout(() => bottomRef.current?.scrollIntoView(), 100);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [threadId]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(m => (
          <MessageBubble key={m.id}
            message={m}
            isAdmin={m.sender_type === 'admin'}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <ReplyInput threadId={threadId} />
    </div>
  );
}
```

#### Reply Input — `reply-input.tsx`

```tsx
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function ReplyInput({ threadId }: { threadId: string }) {
  const [text, setText] = useState('');

  const send = async () => {
    if (!text.trim()) return;
    await supabase.from('chat_messages').insert({
      thread_id: threadId,
      sender_type: 'admin',
      text: text.trim(),
    });
    setText('');
  };

  return (
    <div className="border-t p-4 flex gap-2 items-end">
      <Button variant="outline" size="icon">📎</Button>
      <Textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type your reply..."
        className="flex-1 min-h-[40px]"
        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
      />
      <Button onClick={send} disabled={!text.trim()}>Send</Button>
    </div>
  );
}
```

**Important**: When admin sends a reply with `sender_type: 'admin'`, the mobile app maps it to `from: 'advisor'`. This means the existing `chat/[id].tsx` renders admin replies correctly **without any UI changes**.

### 6.6 App Content Manager (`/dashboard/content`)

Tab-based interface for editing each content section:

```
┌──────────────────────────────────────────────┐
│  [Company Info] [Profile] [Quick Access]      │
│  ──────────────────────────────────────────── │
│                                               │
│  Company Name:  [Prime Capital Advisory______] │
│  Slogan:        [Connecting Capital...      ] │
│  Tagline:       [Your Trusted Partner...    ] │
│  Trust:         [Trusted by businesses...   ] │
│  Phone:         [+971 4 123 4567___________] │
│  WhatsApp:      [+971 4 123 4567___________] │
│  Email:         [info@primecapital.ae______] │
│  City:          [Dubai, UAE________________] │
│                                               │
│  [Save Changes]                               │
└──────────────────────────────────────────────┘
```

Each tab loads/updates the `app_content` table filtered by section name.

### 6.7 Admin Users (`/dashboard/admins`)

```
┌──────┬──────────────┬──────────────┬──────────────┬────────┬──────┐
│ Name │ Email        │ Role         │ Status       │ Last   │ Edit │
├──────┼──────────────┼──────────────┼──────────────┼────────┼──────┤
│ John │ john@k.ae    │ superadmin   │ 🟢 Active    │ 2h ago │ ✏️   │
│ Sara │ sara@k.ae    │ admin        │ 🟢 Active    │ 1d ago │ ✏️   │
└──────┴──────────────┴──────────────┴──────────────┴────────┴──────┘
```

**Roles**:
- `superadmin` — full access to everything
- `admin` — services + opportunities + chat
- `support` — chat only

---

## 7. Service Hierarchy System

### 7.1 Data Model

```ts
// Self-referencing: services.parentId → services.id
type ServiceHierarchy = {
  id: string;
  title: string;
  parentId: string | null;   // null = root service
  children: ServiceHierarchy[];
  relatedTo: string[];       // via service_relations table
  relatedFrom: string[];
};
```

### 7.2 Query: Get Full Service Tree

```ts
import { db } from '@/lib/db';
import { services, serviceRelations } from '@/db/schema';
import { eq, isNull } from 'drizzle-orm';

export async function getServiceTree() {
  const allServices = await db.select().from(services).where(eq(services.isActive, true));
  const relations = await db.select().from(serviceRelations);
  const relMap = new Map<string, string[]>();
  for (const r of relations) {
    if (!relMap.has(r.serviceId)) relMap.set(r.serviceId, []);
    relMap.get(r.serviceId)!.push(r.relatedServiceId);
  }
  const buildTree = (parentId: string | null): any[] =>
    allServices
      .filter(s => s.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(s => ({
        ...s,
        relatedIds: relMap.get(s.id) || [],
        children: buildTree(s.id),
      }));
  return buildTree(null);
}
```

### 7.3 Admin UI: Tree View with Drag-and-Drop

Use `@dnd-kit/core` for drag-and-drop reordering of services within the tree.

### 7.4 Mobile App: Flattened List with Parent Context

The mobile app currently shows a flat list on the services tab. Child services appear in the same list. The admin panel manages the hierarchy, but the mobile app display remains flat unless you choose to add nested sections later.

### 7.5 Related Services on Mobile

Currently the service detail page shows "Related Opportunities" (filtered by keyword). The admin panel can expose a "Related Services" section that would be fetched via the API and displayed similarly — without changing the existing UI structure.

---

## 8. Chat Realtime Flow

### 8.1 Complete Message Lifecycle

```
 MOBILE APP                          SUPABASE                        ADMIN PANEL
 ───────────                         ────────                        ────────────
    │                                    │                               │
    │── INSERT message ─────────────────►│                               │
    │   (sender_type: 'user')           │                               │
    │                                    │── Realtime INSERT event ────►│
    │                                    │    (Append to message list)   │
    │                                    │                               │
    │◄── Realtime INSERT event ──────────│                               │
    │    (from admin reply)              │                               │
    │                                    │◄── INSERT message ────────────│
    │                                    │    (sender_type: 'admin')     │
    │                                    │                               │
    │ Render as "advisor" bubble         │                               │
    │ (No UI code change needed)         │                               │
```

### 8.2 Realtime Subscription in Mobile App

```ts
// src/api/chat.ts
export function subscribeToMessages(
  threadId: string,
  onMessage: (msg: ChatMessage) => void
) {
  return supabase
    .channel(`thread-${threadId}`)
    .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `thread_id=eq.${threadId}`,
      },
      (payload) => {
        const msg: ChatMessage = {
          id: payload.new.id,
          from: payload.new.sender_type === 'admin' ? 'advisor' : 'me',
          text: payload.new.text,
          time: new Date(payload.new.created_at).toLocaleTimeString(),
          image: payload.new.image_url,
          file: payload.new.file_name
            ? { name: payload.new.file_name, size: payload.new.file_size }
            : undefined,
        };
        onMessage(msg);
      }
    )
    .subscribe();
}
```

### 8.3 Upload Attachments

Files uploaded from either mobile or admin go to Supabase Storage bucket `chat-attachments`. The URL is stored in `chat_messages.image_url` or `chat_messages.file_name`.

---

## 9. Mobile App Integration

### 9.1 New API Files (only additions, no UI changes)

#### `src/api/supabase.ts`

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### `src/api/services.ts`

```ts
import { supabase } from './supabase';
import type { Service } from '@/types';

export async function fetchServices(): Promise<Service[]> {
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return (data ?? []).map((s: any) => ({
    id: s.slug,  // Keep using slug as id for URL compatibility
    title: s.title,
    summary: s.summary,
    icon: { set: s.icon_set, name: s.icon_name },
    description: s.description,
    features: s.features,
  }));
}

export async function fetchServiceBySlug(slug: string): Promise<Service | null> {
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!data) return null;
  return {
    id: data.slug,
    title: data.title,
    summary: data.summary,
    icon: { set: data.icon_set, name: data.icon_name },
    description: data.description,
    features: data.features,
  };
}
```

#### `src/api/opportunities.ts`

```ts
import { supabase } from './supabase';
import type { Opportunity } from '@/types';

export async function fetchOpportunities(): Promise<Opportunity[]> {
  const { data } = await supabase
    .from('opportunities')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return (data ?? []).map((o: any) => ({
    id: o.slug,
    tag: o.tag,
    title: o.title,
    amount: o.amount,
    instrument: o.instrument,
    provider: o.provider,
    issuingBank: o.issuing_bank,
    country: o.country,
    metric: o.metric_label ? { label: o.metric_label, value: o.metric_value } : undefined,
    validity: o.validity,
    type: o.type,
    tenor: o.tenor,
    status: o.status,
    description: o.description,
  }));
}
```

#### `src/api/chat.ts`

```ts
import { supabase } from './supabase';
import type { ChatThread, ChatMessage } from '@/types';

export async function fetchThreads(): Promise<ChatThread[]> {
  const { data } = await supabase.from('chat_threads').select('*').order('created_at', { ascending: false });
  return (data ?? []).map((t: any) => ({
    id: t.id,
    name: t.name,
    desk: t.desk,
    preview: '', // Updated via realtime
    time: formatTime(t.created_at),
    unread: 0,
    online: t.online,
    context: t.context_type ? { type: t.context_type, id: t.context_id, label: t.context_label } : undefined,
  }));
}

export async function fetchMessages(threadId: string): Promise<ChatMessage[]> {
  const { data } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at');
  return (data ?? []).map(mapMessage);
}

export async function sendMessage(threadId: string, text: string) {
  await supabase.from('chat_messages').insert({
    thread_id: threadId,
    sender_type: 'user',
    text,
  });
}

function mapMessage(m: any): ChatMessage {
  return {
    id: m.id,
    from: m.sender_type === 'admin' ? 'advisor' : 'me',
    text: m.text,
    time: formatTime(m.created_at),
    image: m.image_url,
    file: m.file_name ? { name: m.file_name, size: m.file_size, mimeType: m.file_mime } : undefined,
    reactions: m.reactions,
  };
}

export function subscribeToMessages(threadId: string, onMessage: (msg: ChatMessage) => void) {
  return supabase
    .channel(`thread-${threadId}`)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `thread_id=eq.${threadId}` },
      (payload) => onMessage(mapMessage(payload.new))
    )
    .subscribe();
}
```

#### `src/api/content.ts`

```ts
import { supabase } from './supabase';

export async function fetchAppContent(section: string) {
  const { data } = await supabase
    .from('app_content')
    .select('content')
    .eq('section', section)
    .single();
  return data?.content ?? null;
}
```

### 9.2 Files to Modify (data source only)

| File | What to change | What stays |
|---|---|---|
| `src/app/(tabs)/home.tsx` | `import { quickAccess, opportunities } from '@/data/mock'` → `import { fetchAppContent } from '@/api/content'` + `import { fetchOpportunities } from '@/api/opportunities'` | All JSX, styles, layout |
| `src/app/(tabs)/services.tsx` | `import { services } from '@/data/mock'` → `import { fetchServices } from '@/api/services'` | All JSX, styles, layout |
| `src/app/(tabs)/opportunities.tsx` | `import { opportunities } from '@/data/mock'` → `import { fetchOpportunities } from '@/api/opportunities'` | All JSX, styles, layout |
| `src/app/(tabs)/chat.tsx` | `import { chatThreads } from '@/data/mock'` → `import { fetchThreads } from '@/api/chat'` | All JSX, styles, layout |
| `src/app/(tabs)/profile.tsx` | `import { profile } from '@/data/mock'` → `import { fetchAppContent } from '@/api/content'` | All JSX, styles, layout |
| `src/app/service/[id].tsx` | `import { services, opportunities } from '@/data/mock'` → `import { fetchServiceBySlug } from '@/api/services'` + `import { fetchOpportunities } from '@/api/opportunities'` | All JSX, styles, layout |
| `src/app/opportunity/[id].tsx` | `import { opportunities } from '@/data/mock'` → `import { fetchOpportunityBySlug } from '@/api/opportunities'` | All JSX, styles, layout |
| `src/app/chat/[id].tsx` | `import { chatThreads, getThreadMessages } from '@/data/mock'` → `import { fetchThreads, fetchMessages, sendMessage, subscribeToMessages } from '@/api/chat'` | All JSX, styles, layout |

**Key rule**: Only change the imports and data-loading logic. Never touch any JSX, StyleSheet, or component structure.

---

## 10. RLS Policies

```sql
-- Services: public can read active, only admins can write
CREATE POLICY "Public can read active services"
  ON services FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage services"
  ON services FOR ALL USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM admin_users WHERE email = auth.email())
  );

-- Opportunities: public read active
CREATE POLICY "Public can read active opportunities"
  ON opportunities FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage opportunities"
  ON opportunities FOR ALL USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM admin_users WHERE email = auth.email())
  );

-- Chat messages: anyone can read and insert, admin insert
CREATE POLICY "Anyone can read messages"
  ON chat_messages FOR SELECT USING (true);

CREATE POLICY "Anyone can send messages"
  ON chat_messages FOR INSERT WITH CHECK (
    sender_type = 'user'
    OR (sender_type = 'admin' AND EXISTS (SELECT 1 FROM admin_users WHERE email = auth.email()))
  );

-- Threads: public read
CREATE POLICY "Anyone can read threads"
  ON chat_threads FOR SELECT USING (true);

CREATE POLICY "Admins can manage threads"
  ON chat_threads FOR ALL USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM admin_users WHERE email = auth.email())
  );

-- Admin users: only superadmins
CREATE POLICY "Superadmins only"
  ON admin_users FOR ALL USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM admin_users WHERE email = auth.email() AND role = 'superadmin')
  );
```

---

## 11. Implementation Roadmap

```
Phase 1: Database (Day 1)
├── Create all Drizzle schemas
├── Run npx drizzle-kit push
├── Enable Realtime on chat_messages, chat_threads
├── Create Storage buckets (chat-attachments, admin-content)
├── Enable Email/Password Auth
└── Seed initial data from mock.ts

Phase 2: Admin Auth + Layout (Day 2)
├── Login page with Supabase Auth
├── Protected layout with session check
├── Sidebar navigation (all sections)
├── Top header with user menu/logout
└── Dashboard stats page

Phase 3: Services CRUD (Day 3-4)
├── Service list table with search + filter
├── Create service form (all fields)
├── Edit service form
├── Icon picker with preview
├── Features dynamic list component
├── Parent service dropdown
├── Related services multi-select
├── Service tree view component
└── Child services management page

Phase 4: Opportunities CRUD (Day 5)
├── Opportunity list table with tag filter
├── Create/Edit opportunity form
├── Service link dropdown
└── Status toggle (Available / In Discussion)

Phase 5: Chat Manager (Day 6-7)
├── Two-panel layout (thread list + chat window)
├── Thread list with search + realtime updates
├── Message bubble component
├── Reply input with file upload
├── Realtime subscription for new messages
└── Upload to Supabase Storage

Phase 6: Content Manager (Day 8)
├── Company info editor
├── Profile editor (intro, key points, markets)
├── Quick access editor
└── Home content editor

Phase 7: Mobile Integration (Day 9-10)
├── Create src/api/supabase.ts
├── Create src/api/services.ts
├── Create src/api/opportunities.ts
├── Create src/api/chat.ts (with realtime)
├── Create src/api/content.ts
├── Update all 8 screen files (imports only)
└── Test all screens still render correctly

Phase 8: Admin Users + Polish (Day 11)
├── Admin user list table
├── Create/edit admin users
├── Role-based access control in sidebar
├── RLS policies verification
└── Final testing
```

---

## 12. Sample Code

### 12.1 Service List Page — Server Component

```tsx
// app/dashboard/services/page.tsx
import { db } from '@/lib/db';
import { services, serviceRelations } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { ServiceList } from '@/components/services/service-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ServicesPage() {
  const allServices = await db.select().from(services).orderBy(services.sortOrder);
  const relations = await db.select().from(serviceRelations);

  const serviceMap = new Map(allServices.map(s => [s.id, s]));
  const childCount = new Map<string, number>();
  for (const s of allServices) {
    if (s.parentId) {
      childCount.set(s.parentId, (childCount.get(s.parentId) || 0) + 1);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services</h1>
        <Link href="/dashboard/services/new">
          <Button>+ Add Service</Button>
        </Link>
      </div>
      <ServiceList services={allServices} childCount={childCount} />
    </div>
  );
}
```

### 12.2 Realtime Chat Subscription — Client Component

```tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function RealtimeMessages({ threadId, onNewMessage }: {
  threadId: string;
  onNewMessage: (msg: any) => void;
}) {
  useEffect(() => {
    const channel = supabase
      .channel(`thread-${threadId}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          onNewMessage(payload.new);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [threadId]);

  return null; // This is a side-effect-only component
}
```

### 12.3 Seed Script

```ts
// scripts/seed.ts
import { db } from '../db';
import { services, opportunities, chatThreads, chatMessages, appContent } from '../db/schema';

async function seed() {
  // Clear existing data
  await db.delete(chatMessages);
  await db.delete(chatThreads);
  await db.delete(opportunities);
  await db.delete(services);
  await db.delete(appContent);

  // Insert services from mock.ts
  const svcData = [
    {
      slug: 'letter-of-credit', title: 'Letter of Credit',
      summary: 'Secure trade transactions with reliable LC solutions.',
      description: 'Reliable Letter of Credit solutions...',
      iconSet: 'ion', iconName: 'document-text-outline',
      features: ['Bank-guaranteed payment security', 'Sight & usance terms', 'Trusted GCC banking network'],
      sortOrder: 0,
    },
    // ... all 8 services from mock.ts
  ];
  for (const s of svcData) {
    await db.insert(services).values(s);
  }

  // Insert opportunities from mock.ts
  // Insert chat threads from mock.ts
  // Insert chat messages from mock.ts
  // Insert app_content (company, profile, quickAccess)

  console.log('✅ Seed complete');
}

seed();
```

---

## 13. Environment Variables

### `.env.local` (Admin Panel)

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.elfjoivfgkdtnnewsswb.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://elfjoivfgkdtnnewsswb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
```

### `.env` (Mobile App)

```env
EXPO_PUBLIC_SUPABASE_URL=https://elfjoivfgkdtnnewsswb.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
```

---

## 14. Key Design Decisions Summary

| Decision | Rationale |
|---|---|
| **Drizzle ORM** | Type-safe SQL, auto-generated types, easy schema migrations |
| **Next.js App Router** | Server components for data fetching, client components for interactivity |
| **shadcn/ui** | Accessible, customizable, matches Tailwind UI ecosystem |
| **Self-referencing `parentId`** | Simple tree hierarchy, single-table query |
| **`service_relations` join table** | Clean many-to-many relationship for related services |
| **Supabase Realtime** | Zero-polling chat, instant delivery both ways |
| **`sender_type: 'admin'` → `from: 'advisor'`** | Mobile app renders without any UI change |
| **Soft delete (`is_active`)** | Prevents accidental data loss, easy restore from admin |
| **Slug-based routing** | URLs stay stable even if UUID changes |
| **Supabase Storage** | Built-in file hosting for chat attachments and icons |
| **JSONB for features** | Flexible schema, no separate table for variable-length arrays |

---

## 15. Files Summary

### Admin Panel Files to Create

```
kazal-admin/
├── .env.local
├── drizzle.config.ts
├── db/
│   ├── index.ts
│   └── schema/
│       ├── index.ts
│       ├── services.ts
│       ├── service-relations.ts
│       ├── opportunities.ts
│       ├── chat-threads.ts
│       ├── chat-messages.ts
│       ├── app-content.ts
│       └── admin-users.ts
├── lib/
│   ├── supabase.ts
│   ├── supabase-server.ts
│   ├── db.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── components/
│   ├── ui/          (shadcn generated)
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   └── dashboard-header.tsx
│   ├── services/
│   │   ├── service-form.tsx
│   │   ├── service-list.tsx
│   │   ├── service-tree.tsx
│   │   ├── icon-picker.tsx
│   │   └── related-services-picker.tsx
│   ├── opportunities/
│   │   ├── opp-form.tsx
│   │   └── opp-list.tsx
│   ├── chat/
│   │   ├── thread-list.tsx
│   │   ├── chat-window.tsx
│   │   ├── message-bubble.tsx
│   │   └── reply-input.tsx
│   └── content/
│       ├── company-editor.tsx
│       ├── profile-editor.tsx
│       └── home-editor.tsx
└── app/
    ├── layout.tsx
    ├── page.tsx
    ├── login/page.tsx
    └── dashboard/
        ├── layout.tsx
        ├── page.tsx
        ├── services/
        │   ├── page.tsx
        │   ├── new/page.tsx
        │   └── [id]/
        │       ├── page.tsx
        │       └── children/page.tsx
        ├── opportunities/
        │   ├── page.tsx
        │   ├── new/page.tsx
        │   └── [id]/page.tsx
        ├── chat/
        │   ├── page.tsx
        │   └── [id]/page.tsx
        ├── content/page.tsx
        └── admins/page.tsx
```

### Mobile App Files to Create/Modify

```
NEW FILES:
src/api/supabase.ts
src/api/services.ts
src/api/opportunities.ts
src/api/chat.ts
src/api/content.ts

MODIFIED FILES (imports only):
src/app/(tabs)/home.tsx
src/app/(tabs)/services.tsx
src/app/(tabs)/opportunities.tsx
src/app/(tabs)/chat.tsx
src/app/(tabs)/profile.tsx
src/app/service/[id].tsx
src/app/opportunity/[id].tsx
src/app/chat/[id].tsx
```
