# Care Pharmacy — Project Context for AI Assistants

## Project Overview

Care Pharmacy is a full-stack pharmacy e-commerce platform with three components:

| Component         | Technology                            | Location           |
|-------------------|---------------------------------------|--------------------|
| Backend API       | Node.js, Express 5, MongoDB/Mongoose  | `backend/`         |
| Admin Dashboard   | Next.js 16, React 19, MUI v7, SWR    | `admin_dashboard/` |
| Mobile App        | Flutter 3 (Dart), Provider, http pkg  | `lib/` (repo root) |

---

## Architecture

### Backend (`backend/`)
- **Entry point**: `server.js` (the ONLY production server). `src/index.js` is dead/legacy — do NOT use it; it has wide-open CORS, no DB connection, and no JWT check. It should be deleted.
- **Port**: 3000 (configured via `PORT` env var)
- **Database**: MongoDB via Mongoose. Connect string in `MONGO_URI` env var.
- **Auth**: JWT-based. Two secrets: `JWT_SECRET` (users) and `ADMIN_JWT_SECRET` (admin).
  - ⚠️ **Known bug**: `generateToken` in `src/utils/generateToken.js` ignores extra arguments — admin tokens are currently signed with `JWT_SECRET`, not `ADMIN_JWT_SECRET`. The dual-secret architecture does not work until this is fixed.
- **Routes**: All under `/api/`. Auth → `/api/auth`, Medicines → `/api/medicines`, Orders → `/api/orders`, Users → `/api/users`, Reviews → `/api/reviews`, Admin → `/api/admin`
- **File uploads**: Stored locally in `uploads/avatars/` (user avatars) and `uploads/medicines/` (medicine images). Served statically from `/uploads`.
- **Email**: Nodemailer + Handlebars templates in `src/emails/templates/`.
- **Push notifications**: Firebase Admin SDK (`firebase-admin`). Device tokens in `DeviceToken` model.
- **API docs**: Swagger UI at `/api-docs` (swagger-jsdoc + swagger-ui-express). Not auth-protected — restrict in production.
- **Soft delete**: Medicines use `is_deleted: true` flag. Always filter `{ is_deleted: { $ne: true } }` in public routes.

### Admin Dashboard (`admin_dashboard/`)
- **Framework**: Next.js App Router (all pages in `app/`).
- **UI library**: Material UI v7 + Emotion. Tailwind CSS is installed but produces no output — effectively unused.
- **Data fetching**: SWR for all GET requests.
- **API base**: Configured via `NEXT_PUBLIC_ADMIN_API_BASE_URL` env var. The canonical constant lives in `app/lib/api.ts` — always import `ADMIN_API_BASE` and `apiFetch` from there, never redefine them per-page.
  - ⚠️ **Known issue**: Currently all pages define `API_BASE` locally and do NOT call `apiFetch`. The centralised helper in `lib/api.ts` is dead code.
- **Auth**: Admin JWT currently stored in `localStorage` (`admin_token`, `admin_user`).
  - ⚠️ **Known security issue**: planned migration to `httpOnly` cookies.
  - ⚠️ **Known issue**: No `middleware.ts` route protection — all auth guards are client-side only.
- **Pages**: dashboard, medicines, orders, users, reviews, config.
- **Layout**: Each page composes `<Sidebar />` + `<HeaderBar />` + `<Toolbar />` (spacer) + page content.
- **Toast pattern**: Local state `{ open: boolean, message: string, severity: 'success'|'error'|'warning'|'info' }` with MUI `<Snackbar>` + `<Alert>`.

### Flutter App (repo root `lib/`)
- **State management**: Provider. Core providers in `lib/core/providers/`.
- **API client**: `lib/core/services/api_client.dart`. Base URL switches on `kIsWeb`:
  - ⚠️ **Known critical issue**: URL is hardcoded to `http://10.0.2.2:3000/api` (Android emulator only) — must be changed via `--dart-define=API_URL=...` for production builds.
- **Auth token**: Persisted via `SharedPreferences`.
  - ⚠️ **Known security issue**: Should use `flutter_secure_storage` — not yet installed.
- **Token sync**: After login/logout, `AuthProvider` must call `updateToken()` on each provider that owns an `ApiClient`. This is scattered across screens — see Known Issues.
- **Routing**: Named routes defined in `lib/core/routes/app_routes.dart`. Mix of named routes and `MaterialPageRoute` push — prefer named routes for consistency.
- **Theme**: `lib/core/theme/app_theme.dart`.
- **Snackbar**: Use `showSnackbar(context, message)` from `lib/core/utils/snackbar.dart` for all user feedback.
- **Features**: auth (email/password + Google OAuth), home feed with seasonal banner, medicine detail + image gallery + reviews, cart (SharedPreferences persistence), checkout, orders list/detail with cancel, profile (avatar upload, address, payment method), push notifications (FCM).

---

## Environment Configuration

### Backend `.env` keys (see `.env.example`)
```
PORT=3000
MONGO_URI=                         # MongoDB connection string (required)
JWT_SECRET=                        # User JWT signing secret (required — app exits without it)
JWT_EXPIRES_IN=7d
ADMIN_JWT_SECRET=                  # Admin JWT secret (intended; see known bug above)
ADMIN_JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=                  # For Google OAuth verification
ALLOWED_ORIGINS=                   # Comma-separated list of allowed CORS origins
RATE_LIMIT_MAX=400                 # Global rate limit (requests per 15 min per IP)
FIREBASE_PROJECT_ID=               # For push notifications
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
SMTP_HOST=                         # Nodemailer SMTP config
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM_NAME=Care Pharmacy
MAIL_FROM_EMAIL=
ADMIN_NOTIFICATION_EMAILS=         # Comma-separated admin emails for order notifications
ADMIN_SEED_EMAIL=                  # Used by seed script only
ADMIN_SEED_PASSWORD=               # Used by seed script only — do NOT use as UI default
APP_BASE_URL=                      # Used to build absolute URLs for uploaded files
ADMIN_DASHBOARD_URL=               # Link included in email templates
```

> ⚠️ **Git history note**: `backend/.env` was committed in `75244e1` and remains readable in git history (`git show 75244e1:backend/.env`). If `JWT_SECRET` from that commit ever reached a non-dev environment, it must be confirmed rotated. No history rewrite has been performed.

### Admin Dashboard `.env.local` keys
```
NEXT_PUBLIC_ADMIN_API_BASE_URL=http://localhost:3000/api/admin
```

### Flutter build args

`String.fromEnvironment('API_URL')` is a **compile-time constant** — a single
`--dart-define=API_URL=...` sets the URL for both web and non-web builds.
The `kIsWeb` split in `api_client.dart` only affects the **default value** used when no
`API_URL` is supplied (bare local dev, no `--dart-define`):

- **No `--dart-define`**: Android emulator falls back to `http://10.0.2.2:3000/api`; web falls back to `http://localhost:3000/api`.
- **Any `--dart-define=API_URL=X`**: both branches use `X` — the kIsWeb check is irrelevant.

```bash
# Bare local dev — no flag needed; platform defaults above apply automatically
flutter run

# Production — one flag covers both web and non-web
flutter build apk --dart-define=API_URL=https://api.example.com --dart-define=GOOGLE_CLIENT_ID=xxx
flutter build web --dart-define=API_URL=https://api.example.com --dart-define=GOOGLE_CLIENT_ID=xxx
```

---

## Running the Projects

```bash
# Backend
cd backend
cp .env.example .env     # Fill in all required values
npm install
npm start                 # Runs server.js with --watch on port 3000

# Admin Dashboard
cd admin_dashboard
echo "NEXT_PUBLIC_ADMIN_API_BASE_URL=http://localhost:3000/api/admin" > .env.local
npm install
npm run dev               # http://localhost:3001

# Flutter (Android emulator)
flutter pub get
flutter run --dart-define=API_URL=http://10.0.2.2:3000/api
```

### Seed data
```bash
cd backend
node src/utils/seed.js
# Creates admin user from ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD env vars
# and optionally sample medicines
```

---

## Known Issues (Prioritized Fix Order)

These are tracked issues. Do not implement workarounds that make them harder to fix later.

### 🔴 Critical — Fix Before Any Production Release

1. **Backend: `generateToken` broken** (`src/utils/generateToken.js`) — Function ignores arguments beyond the first. Admin tokens are signed with `JWT_SECRET`, not `ADMIN_JWT_SECRET`. Fix the function signature to accept `(userId, secret, expiresIn)`.

2. **Admin dashboard: hardcoded credentials in login form** (`app/(auth)/login/page.tsx:18–19`) — Both email and password state are initialised with real seed admin credentials. Change both to `useState("")` immediately.

3. **Admin dashboard: JWT in localStorage** (`app/lib/api.ts:6`) — XSS-accessible. Migrate to `httpOnly; SameSite=Strict` cookies set server-side.

4. **Admin dashboard: no route protection** — Add `middleware.ts` at project root to check auth cookie/token before allowing access to any route under `/dashboard`, `/medicines`, `/orders`, `/users`, `/reviews`, `/config`.

5. **Flutter: auth token in SharedPreferences** (`lib/core/providers/auth_provider.dart:26`) — Add `flutter_secure_storage: ^9.0.0` to `pubspec.yaml` and replace all `auth_token` read/write calls.

6. **Flutter: hardcoded development API URL** (`lib/core/services/api_client.dart:10`) — Use `--dart-define=API_URL` build argument (see Running section above).

7. **Flutter: full credit card number stored/transmitted** (`lib/core/models/payment_method.dart`, `lib/core/services/user_api_service.dart:63`) — Full 16-digit card numbers are stored in provider state and sent to the backend. This violates PCI DSS. Integrate a real payment SDK (Stripe, etc.) or only handle tokenized card data.

### 🟠 High

8. **Backend: unescaped regex in search endpoints** (all list controllers) — `new RegExp(userInput, 'i')` without escaping. Escape: `input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`.

9. **Backend: reset token fields leak in `/api/auth/me`** (`authController.js:99`) — Fetch user with `.select('-password -resetPasswordToken -resetPasswordExpires')`.

10. **Backend: file upload MIME filter uses OR logic** (`src/utils/upload.js:26`) — Change `isImageMime || isAllowedExt` to `isImageMime && isAllowedExt`. Add magic bytes check.

11. **Backend: no per-endpoint rate limiting on auth routes** — Add strict rate limiter (10 req/15min per IP) to `/api/auth/login`, `/api/auth/register`, `/api/auth/request-password-reset`.

12. **Backend: reset token stored as plaintext** (`src/models/User.js:37`) — Store `sha256(token)` in DB; send raw token to user; verify by hashing incoming token.

13. **Admin: `apiFetch` helper is never called** — All pages reinvent token reading inline. Migrate all `fetch()` calls to `apiFetch()` from `lib/api.ts`.

14. **Admin: 401 redirect only in dashboard fetcher** — Add 401 redirect to the fetcher in orders, medicines, users, reviews, and config pages.

15. **Admin: Rules of Hooks violation** (`app/orders/page.tsx:140`) — `if (!useIsClient()) return null` calls a hook conditionally. Hoist to top of component.

16. **Flutter: no SSL certificate pinning** — Implement via `dio` + custom `BadCertificateCallback` or `http_certificate_pinning`.

17. **Flutter: cart FAB always visible** (`home_screen.dart:257`) — Change `totalItems >= 0` to `totalItems > 0`.

18. **Flutter: no image caching** — Add `cached_network_image` package. Replace all `Image.network()` calls.

19. **Flutter: fake payment demo UI** (`checkout_screen.dart:113`) — Remove the demo disclaimer text. Do not ship card collection without a real payment gateway.

20. **Backend: `src/index.js` dead server file** — Wide-open CORS, no DB connection, no JWT check. Delete before any non-dev use.

21. **Backend: `updateMedicine` mass assignment** (`medicineController.js`) — Full `req.body` passed to Mongoose; whitelist allowed fields before save.

### 🟡 Medium

- Backend: `User.role` needs `enum: ['user', 'admin']` constraint.
- Backend: `ensureAbsoluteUrl` duplicated in 3 controllers → extract to `src/utils/url.js`.
- Backend: 8 admin controller functions have validators wired but never call `validationResult(req)`.
- Backend: Missing compound indexes: `{ category: 1, is_deleted: 1 }`, `{ isTrending: 1, is_deleted: 1 }`, `{ status: 1, createdAt: -1 }` on Medicine/Order collections.
- Backend: Duplicate route `/api/medicines/:id/reviews` conflicts with medicine detail route → remove.
- Admin: `API_BASE` constant defined in 7 files → consolidate into `app/lib/api.ts`.
- Admin: `fetcher`, `useIsClient`, `formatDate`, and label+value display components duplicated across all pages → extract to `app/lib/hooks.ts` and `app/components/`.
- Admin: `URL.createObjectURL` in medicine edit dialog never revoked → add `useEffect` cleanup.
- Admin: Pervasive `any` TypeScript types → create `app/lib/types.ts` with API response interfaces.
- Admin: Medicine deletion toast uses `severity: "error"` for a successful action → fix.
- Admin: `useEffect` calling `mutate()` on dashboard causes redundant SWR refetch → remove.
- Admin: Recharts imported statically → use `next/dynamic` with `{ ssr: false }`.
- Admin: External Unsplash placeholder image URL → replace with local asset in `public/`.
- Flutter: Composition filter hardcoded → derive from loaded medicines.
- Flutter: `Future.delayed` in `initState` for animation → use `addPostFrameCallback`.
- Flutter: Search in HomeScreen has no debounce → add 300ms debounce via `Timer`.
- Flutter: `_buildGreeting` param named `email` receives user name → rename, remove `@` splitting.
- Flutter: Medicine default rating/ratingCount values (4.5/120) are fake → use 0/0 as defaults.
- Flutter: Token sync must be called manually on every provider after login → refactor to shared ApiClient singleton.
- Flutter: `ProfileProvider` keyed by email instead of user ID → change to user ID.

### 🟢 Low / Backlog

- Backend: `morgan('dev')` → use `'combined'` or structured JSON logger in production.
- Backend: Swagger UI at `/api-docs` has no auth → add HTTP basic auth or remove in production.
- Backend: `autoIndex: true` in production DB connection → set `autoIndex: false`.
- Backend: `getMyOrders` returns all orders with no pagination → add limit.
- Backend: Admin review endpoint exists at both `/api/reviews` and `/api/admin/reviews` → consolidate.
- Admin: Tailwind CSS installed but produces no output → remove or start using it consistently.
- Admin: `StatCard` component defined but never used → delete.
- Admin: Sidebar is a permanent drawer with no mobile breakpoint → add responsive hamburger menu.
- Flutter: No unit or widget tests — add tests for providers and API services.
- Flutter: `MedicineDetailArgs` defined inside `home_screen.dart` → move to `core/routes/`.
- Flutter: Navigation inconsistency (named routes vs `MaterialPageRoute`) → standardise on named routes.
- Flutter: Locale-unaware date formatting (`month/day/year`) → add `intl` package.
- Flutter: Google Fonts loaded from network → bundle fonts as local assets.
- Flutter: Missing `const` constructors on stateless widgets → run `dart fix --apply`.
- Flutter: Screen reader accessibility (Semantics labels on images and icon buttons).

---

## Code Conventions

### Backend
- All route handlers use `express-async-handler` (`asyncHandler` wrapper).
- Input validation uses `express-validator`. Always call `validationResult(req)` at the top of validated handlers and return early if errors exist.
- Success response shape: `{ data: <payload> }` for single/list resources; `{ message: "..." }` for mutations with no return body.
- Error response shape: `{ message: "...", errors: [...] }` — the `errorHandler` middleware handles formatting.
- Soft delete on medicines: set `is_deleted: true`, never hard-delete records.
- File uploads: avatars → `uploads/avatars/`, medicine images → `uploads/medicines/`.

### Admin Dashboard

#### Current state
- Each page declares its own `API_BASE` constant and inline `fetcher` — the centralised helpers in `app/lib/api.ts` are dead code (`apiFetch` and `ADMIN_API_BASE` have zero imports across the codebase).
- Auth token read from `localStorage` (`admin_token`) — 25 `localStorage` reads across 11 files.
- All auth guards are client-side only; no `middleware.ts` exists.

#### Target patterns (NOT YET IMPLEMENTED)
- Import `ADMIN_API_BASE` and `apiFetch` from `app/lib/api.ts` — do not redefine per file.
- All GET fetching via SWR with a shared `fetcher` extracted to `app/lib/hooks.ts`.
- Mutations: use `apiFetch()` + call `mutate()` on the relevant SWR key to revalidate.
- Auth via `httpOnly; SameSite=Strict` cookies set server-side (replace `localStorage`).

#### Stable conventions (apply now)
- Layout structure for every protected page:
  ```tsx
  <Box sx={{ display: "flex", minHeight: "100vh" }}>
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, background: "#f6f8fb" }}>
      <HeaderBar title="Page Title" />
      <Toolbar />
      <Box sx={{ p: 3 }}>
        {/* page content */}
      </Box>
    </Box>
  </Box>
  ```
- Toast: `setToast({ open: true, message: "...", severity: "success"|"error"|"warning" })`.

### Flutter
- Providers: `context.read<XProvider>()` for one-shot reads (event handlers); `context.watch<XProvider>()` in `build()`.
- API services take `ApiClient` in their constructor — they never create one.
- Auth is the source of truth. Other providers receive the token only when `AuthProvider` notifies after login/logout.
- Named route navigation: `Navigator.pushNamed(context, AppRoutes.xxx)`.
- User feedback: `showSnackbar(context, message)` from `lib/core/utils/snackbar.dart`.
- Error handling: providers should expose an `errorMessage` string field alongside data; UI must render it explicitly — never swallow errors silently.
