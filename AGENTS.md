# Kazal Mobile App — Project Standards

## Git Rules (CRITICAL)
- NEVER commit or push automatically. Only when explicitly asked.
- Each functionality = one commit with a descriptive message.
- Commit format: `type(scope): description` (e.g., `feat(auth): add login screen`).
- Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`.
- Always review `git status`, `git diff`, and `git log` before committing.
- Do NOT stage files that are unrelated to the current task.

## File Size Limit (CRITICAL)
- No single file should exceed **300 lines**.
- If a file approaches 300 lines, extract logic into:
  - Reusable components in `components/`
  - Custom hooks in `hooks/`
  - Utility functions in `utils/`
  - Constants in `constants/`

## Folder Structure

```
src/
├── api/             # API layer (client, endpoints)
├── app/             # Expo Router file-based routes (unchanged)
├── components/      # Shared UI components (one file per component, max 300 lines)
│   └── chat/        # Chat-specific components (sub-directory for complex features)
├── constants/       # Shared constants (layout, dimensions, enums, chat config)
├── data/            # Mock data / static content
├── hooks/           # Custom React hooks
├── providers/       # React Context providers
├── theme/           # Design tokens (colors, typography, spacing)
├── types/           # TypeScript type definitions
└── utils/           # Pure utility functions (format, validation, styles, chat utils)
```

## Component Standards

### One component per file
- Each file exports exactly one named function.
- No `export default` for components (except page routes in `app/`).
- Barrel export from `src/components/index.ts`.

### Component structure
```tsx
type Props = {
  // Props defined inline at the top
};

export function ComponentName({ ... }: Props) {
  return ( ... );
}

const styles = StyleSheet.create({ ... });
```

### Composition over configuration
- Build complex UIs by composing small components (GlassCard + IconTile + Txt = ServiceCard).
- Keep components focused on a single responsibility.
- Extract repeated UI patterns into shared components.

## Theming System

### Design tokens (src/theme/)
- `Colors` — All color values in one object.
- `Gradients` — Linear gradient color arrays.
- `Spacing` — Spacing scale (xs through xxxl).
- `Radius` — Border radius scale.
- `Type` — Typography presets (TextStyle objects).
- `glow()` / `cardShadow` — Shadow utilities.

### Access via useTheme() hook
- Wrap app in `ThemeProvider` from `src/providers/`.
- Use `useTheme()` hook for dynamic access: `const { colors, spacing, type } = useTheme();`
- For static usage (styles outside component), import directly: `import { Colors } from '@/theme'`.

## Import Conventions

- Use `@/` alias for all source imports: `@/theme`, `@/components`, `@/types`, `@/hooks`, `@/constants`, `@/utils`.
- Use `import type` for type-only imports.
- Keep imports grouped: React → External libs → Internal modules → Local relatives.

## Code Style

- No comments in code (unless absolutely necessary for complex logic).
- Use `StyleSheet.create()` at module level, never inline styles.
- No `any` — use strict typing.
- Accessibility: add `accessibilityLabel`, `accessibilityRole` where appropriate.
- Strings are hardcoded (no i18n for now — use mock data from `src/data/mock.ts`).

## Complex Feature Pattern (e.g., Chat)

For features with 5+ components, use a sub-directory under `components/`:

```
components/chat/
├── index.ts                    # Barrel export
├── ChatHeader.tsx              # Single responsibility
├── ChatBubble.tsx              # React.memo for performance
├── ChatMessageList.tsx         # FlatList with virtualization
├── ChatInput.tsx               # Input bar
└── ...                         # One file per component
```

Rules:
- Each file ≤ 300 lines
- Logic in `hooks/useChat.ts`
- Constants in `constants/chat.ts`
- Utilities in `utils/chat.ts`
- Screen file in `app/` is a thin orchestrator (< 100 lines)

## Performance Rules (Chat)
- Use `FlatList` (not ScrollView) for message lists
- Use `React.memo` on message bubble components
- Use `removeClippedSubviews`, `windowSize`, `maxToRenderPerBatch` for large lists
- Extract gesture/Animation logic into the component (not the hook)

## New Feature Checklist

1. Define types in `src/types/` first.
2. Add mock data in `src/data/mock.ts` if needed.
3. Create UI components in `src/components/` (one per file, ≤ 300 lines).
4. Add custom hooks in `src/hooks/`.
5. Wire up in `src/app/` route (thin orchestrator).
6. Add utilities to `src/utils/` if reusable logic.
7. Add constants to `src/constants/` if config values needed.
8. Commit with descriptive message.
