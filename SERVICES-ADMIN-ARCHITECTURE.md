# Services + Sub-Categories — Admin Architecture

> Goal: Move services and their sub-categories from hardcoded app data (`src/data/services.ts`) to a Supabase-backed, admin-managed model. The admin panel (Next.js + Drizzle) creates/edits services and sub-categories; the mobile app reads them through a thin API layer and keeps the UI unchanged.

**Companion**: [KAZAL-ADMIN-DOCS.md](./KAZAL-ADMIN-DOCS.md) — full admin panel stack (Next.js 14, Drizzle ORM, Supabase, shadcn/ui). This document only covers the **services / sub-categories** module built on that architecture.

---

## 1. Current State (Mobile App, Hardcoded)

### 1.1 Files involved

| File | Role |
|---|---|
| `src/types/service.ts` | `Service` + `SubCategory` TS types |
| `src/data/services.ts` | 8 hardcoded services, each with `image` + `subCategories[]` |
| `src/components/ServiceCard.tsx` | List card on `/(tabs)/services` |
| `src/components/SubCategoryCard.tsx` | Sub-category card on the detail page |
| `src/app/(tabs)/services.tsx` | Services list screen (reads `services` from `@/data`) |
| `src/app/service/[id].tsx` | Detail screen: hero image + sub-category cards + highlights |

### 1.2 Current data shape

```ts
// src/types/service.ts
type SubCategory = {
  title: string;
  caption: string;
  icon: IconRef; // { set: 'ion' | 'mci'; name: string }
};

type Service = {
  id: string;
  title: string;
  summary: string;
  icon: IconRef;
  image: string;          // hero image URL
  description: string;
  features: string[];     // "Key Highlights"
  subCategories: SubCategory[];
};
```

**Problem**: 8 services × 3–4 sub-categories are hardcoded. Adding/editing a service, its sub-categories, or its hero image requires a code change + app release.

---

## 2. Target Architecture

```
           ADMIN PANEL (Next.js + Drizzle)
             Services Manager
        ┌──────────────────────────────┐
        │  Service CRUD                │
        │  Sub-Category CRUD (child)   │
        │  Image upload → Storage      │
        └──────────────┬───────────────┘
                       │
               ┌───────▼────────┐
               │    Supabase     │
               │  services       │
               │  sub_categories │   ← two-level, explicit children
               │  service_images │   ← Storage bucket
               │  + RLS          │
               └───────┬────────┘
                       │  SELECT only (public read)
                       │  + Realtime (optional)
               ┌───────▼────────┐
               │   MOBILE APP   │
               │ src/api/services│
               │ useServices()  │   ← fallback to /data seed when offline
               └────────────────┘
```

### 2.1 Why an explicit `sub_categories` table (not `parentId`)

`KAZAL-ADMIN-DOCS.md` §7 proposed a single self-referencing `services.parentId` tree ("Letter of Credit" → "Sight LC"). The app now models each service with a **heading + caption sub-category list**:

- A sub-category is not itself a routable service page — it is a tappable *inquiry card* under a service.
- Each sub-category is always owned by exactly one parent service.
- The detail page renders them as a flat list under the "Sub Categories" heading.

→ Dedicated **`sub_categories`** table (FK → `services.id`) is simpler, type-safe, and matches the UI exactly. The `parentId` self-reference stays available in the admin for future deeper nesting if needed.

---

## 3. Database Schema (Drizzle ORM + Supabase)

### 3.1 `services`

Adds the new `image` column to the schema from `KAZAL-ADMIN-DOCS.md` §3.2:

```ts
// kazal-admin/db/schema/services.ts
export const services = pgTable('services', {
  id: uuid().primaryKey().defaultRandom(),
  slug: text().unique().notNull(),
  title: text().notNull(),
  summary: text().notNull(),
  description: text().notNull(),
  image: text().notNull().default(''),        // ← hero image (storage or CDN URL)
  iconSet: text('icon_set').notNull().default('ion'),
  iconName: text('icon_name').notNull(),
  features: jsonb().notNull().default([]),   // "Key Highlights"
  parentId: uuid('parent_id').references((): any => services.id), // optional future nesting
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### 3.2 `sub_categories` (new)

```ts
// kazal-admin/db/schema/sub-categories.ts
export const subCategories = pgTable('sub_categories', {
  id: uuid().primaryKey().defaultRandom(),
  serviceId: uuid('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  slug: text().unique().notNull(),
  title: text().notNull(),
  caption: text().notNull(),             // shown under heading, truncated (numberOfLines={2})
  iconSet: text('icon_set').notNull().default('ion'),
  iconName: text('icon_name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### 3.3 Relationships

```ts
services         1 ──── *  sub_categories   (service_id, cascade delete)
services         1 ──── *  opportunities    (service_id)        // already in KAZAL-ADMIN-DOCS §3.2
services         * ──── *  services         (service_relations) // already exists
```

### 3.4 Generated TS types (mirror the mobile `Service` / `SubCategory`)

```ts
type SubCategoryRow = { id, serviceId, slug, title, caption, iconSet, iconName, sortOrder, isActive };
type ServiceWithSubs = ServiceRow & { subCategories: SubCategoryRow[] };
```

---

## 4. Supabase SQL Migration

```sql
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null,
  description text not null,
  image text not null default '',
  icon_set text not null default 'ion',
  icon_name text not null,
  features jsonb not null default '[]'::jsonb,
  parent_id uuid references public.services(id) on delete set null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sub_categories (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  slug text unique not null,
  title text not null,
  caption text not null,
  icon_set text not null default 'ion',
  icon_name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sub_categories_service_id_idx on public.sub_categories (service_id);
```

---

## 5. Row Level Security (RLS)

Public read, private writes (admin only, via the admin panel's authenticated service role / `AdminServiceKey` as documented in KAZAL-ADMIN-DOCS.md).

```sql
alter table public.services enable row level security;
alter table public.sub_categories enable row level security;

-- anon (mobile app): read only, active rows
create policy "services_public_read" on public.services
  for select to anon, authenticated
  using (is_active = true);

create policy "sub_categories_public_read" on public.sub_categories
  for select to anon, authenticated
  using (is_active = true);

-- admin writes: bypass via the service-role key (server-only)
```

> ⚠️ **Students note**: never give the anon key write access to `services`/`sub_categories`. Admin writes happen only through the Next.js server using the service-role key.

---

## 6. Mobile App Integration

### 6.1 API layer (new)

```
src/api/
├── client.ts       # createClient(supabaseUrl, supabaseAnonKey) — from .env
└── services.ts      # fetchServices(), fetchServiceById(id), subscribeServiceChanges()
```

```ts
// src/api/services.ts
import { supabase } from './client';
import type { Service, SubCategory } from '@/types';

export async function fetchServices(): Promise<Service[]> {
  const { data: services } = await supabase
    .from('services')
    .select(`*, sub_categories(*)`)
    .eq('is_active', true)
    .order('sort_order');

  return (services ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    summary: s.summary,
    description: s.description,
    image: s.image,
    icon: { set: s.icon_set as any, name: s.icon_name as any },
    features: s.features,
    subCategories: (s.sub_categories ?? []).map(scToSubCategory),
  }));
}
```

### 6.2 Hook with mock fallback (keeps the app working offline / before wiring)

```ts
// src/hooks/useServices.ts
export function useServices() {
  const [services, setServices] = useState<Service[]>(mockServices);
  useEffect(() => {
    let on = true;
    fetchServices().then((remote) => on && remote.length && setServices(remote)).catch(() => {});
    return () => { on = false; };
  }, []);
  return services;
}
```

`src/data/services.ts` stays as the **seed/fallback dataset** (used by `useServices` when Supabase is unreachable), so no screen code changes:

- `src/app/(tabs)/services.tsx` → `useServices()`
- `src/app/service/[id].tsx` → `useServices().find(...)` + hero image + `SubCategoryCard`s (unchanged UI)

Type-safety check: the DB fetch shape must map 1:1 to `Service` / `SubCategory` — add an `IconRef` helper (`iconFrom(set, name)`) in `src/utils/icon.ts` as long-term function.

---

## 7. Admin Panel Pages

| Route | Purpose |
|---|---|
| `/admin/services` | Table list, `isActive` toggle, sort order, link to detail |
| `/admin/services/new` | Create service: title, slug, summary, description, image, icon, features |
| `/admin/services/[id]` | Edit service + **Sub-Categories sub-table** (add/edit/reorder/disable each child) |
| `/admin/services/[id]/image` | Upload hero image → Storage bucket `service-images`, store public URL |

Sub-category row form:
- `title`, `caption`, `icon` (set + name pickers), `sortOrder`, `isActive`
- Validation: title/caption required, `slug` auto-generated, `sortOrder` integer, at least one of `icon` set/name

---

## 8. Storage & Image Upload

- Bucket: `service-images` (public)
- Path: `services/<slug>/<timestamp>.jpg` (hero) and `sub-categories/<id>.png` (future icons)
- Admin uploads avail the persisted public URL stored in `services.image`

---

## 9. Seed Migration (port the current hardcoded data)

1. Script reads the current JSON in `src/data/services.ts` and inserts 8 `services` rows.
2. For each service inserts its `subCategories[]` into `sub_categories`.
3. `features` array → jsonb, `icon` object → `icon_set` + `icon_name`.

---

## 10. Roadmap

1. Apply SQL migration + RLS + seed (Supabase).
2. Wire `src/api/client.ts` with env keys (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`).
3. Add `useServices()` and swap the two screens; keep `src/data/services.ts` as fallback.
4. Add the Next.js admin CRUD pages + upload.
5. Validate: admin edits a sub-category caption → mobile reflects on next refresh (or realtime subscription).

---

## references

- KAZAL-ADMIN-DOCS.md §2 (Data Map), §3 (Schema), §6.3 (Services Manager), §7 (Hierarchy)
- Mobile: `src/types/service.ts`, `src/data/services.ts`, `src/app/(tabs)/services.tsx`, `src/app/service/[id].tsx`