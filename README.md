# Prime Capital Advisory — Commercial Finance Advisory (UI Prototype)

> Working repo name: **Kazal**. Brand shown in-app: **Prime Capital Advisory**
> ("Connecting Capital with Opportunity").

A premium, dark-themed mobile app UI for a commercial finance advisory business
serving the GCC (UAE, Saudi Arabia, Qatar, Oman).

> **Design phase only.** This is a static, presentation-ready prototype. All data
> is mock/placeholder. There is no backend, database, authentication, or API
> integration — that comes in a later development phase.

Built with **Expo (SDK 56)**, **Expo Router**, **TypeScript**, `react-native-svg`,
`expo-linear-gradient`, and `expo-blur`.

## Run it

```bash
npm install        # already done if you cloned with node_modules
npx expo start     # then press "i" for iOS simulator or scan the QR with Expo Go
```

- iOS simulator: press `i`
- Android emulator: press `a`
- Physical device: install **Expo Go** and scan the QR code

## Screens

| Screen | Route |
| --- | --- |
| Splash | `src/app/index.tsx` |
| Home | `src/app/(tabs)/home.tsx` |
| Services | `src/app/(tabs)/services.tsx` |
| Service Detail | `src/app/service/[id].tsx` |
| Opportunities | `src/app/(tabs)/opportunities.tsx` |
| Opportunity Detail | `src/app/opportunity/[id].tsx` |
| Contact / Inquiry | `src/app/contact.tsx` |
| Chat List | `src/app/(tabs)/chat.tsx` |
| Chat Detail | `src/app/chat/[id].tsx` |
| Login Required | `src/app/login.tsx` (modal) |
| Profile / About | `src/app/(tabs)/profile.tsx` |

Bottom navigation: **Home · Services · Deals · Chat · Profile**
(custom glass floating bar in `src/app/(tabs)/_layout.tsx`).

## Design system

Everything is tokenised in `src/theme/index.ts`:

- **Background** — deep navy / near-black (`#05080F`) with ambient cyan/blue glows
- **Accents** — electric cyan (`#2BD2FF`), deep blue (`#1C7DF0`), teal (`#27E0C8`)
- **Status** — green (Available), amber (In Discussion)
- **Surfaces** — soft glassmorphism cards with hairline borders and subtle glow
- **Type** — clean system sans-serif with a bold hero → body → label hierarchy

Reusable UI lives in `src/components/` (Screen, GlassCard, Logo, Button, Chip,
StatusBadge, cards, etc.). Mock content lives in `src/data/mock.ts`.

## Notes for the next phase

- The hero, office, and login panels use a vector **skyline** motif. To use a real
  advisor/skyline photo, drop an `<Image>` into the hero block in `home.tsx`.
- Login is intentionally only triggered when a user **inquires** or **chats**.
- All forms and the "send" / "submit" actions are static placeholders.
# kazal-mobile-app
