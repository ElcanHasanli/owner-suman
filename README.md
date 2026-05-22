# SUMAN Owner Panel

Platform sahibi (Owner) üçün idarəetmə paneli — şirkətlər, lisenziyalar və admin/kuryer hesabları.

## Texnologiyalar

- Next.js (App Router)
- TypeScript
- CSS Modules

## Quraşdırma

```bash
npm install
cp .env.local.example .env.local
```

**Lokal:** `.env.local` (git-ə düşmür):

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

**Production build** (`npm run build` / deploy): repoda `.env.production` var — sorğular `https://api.suman.khamsacraft.az/api/...` ünvanına gedir.

> `.env.local` faylı **bütün mühitlərdə** `.env` və `.env.production`-ı üstələyir. Serverdə deploy edərkən `.env.local` içində `localhost` olmamalıdır; yalnız öz maşınında saxlayın.

Hosting (Vercel və s.): `NEXT_PUBLIC_API_URL=https://api.suman.khamsacraft.az` environment variable təyin edin.

## İşə salma

Backend (`api-suman`) işləməlidir:

```bash
npm run dev
```

Panel: [http://localhost:3000](http://localhost:3000)

## Test hesabı

| Email | Şifrə |
|-------|-------|
| `owner@suman.az` | `owner123` |

## Səhifələr

| Route | Təsvir |
|-------|--------|
| `/login` | Giriş |
| `/` | Dashboard |
| `/companies` | Şirkətlər siyahısı |
| `/companies/new` | Yeni şirkət |
| `/companies/[id]` | Şirkət detalı, lisenziya |
| `/companies/[id]/users` | Admin/kuryer hesabları |

## Mobil (APK + iOS)

Android və iOS üçün Capacitor quraşdırılıb. Ətraflı: **[MOBILE.md](./MOBILE.md)**

```bash
npm run mobile:android   # Android Studio → APK
npm run mobile:ios       # Xcode (Mac)
```

TestFlight (çox iPhone-a paylama): **[MOBILE.md § TestFlight](./MOBILE.md#testflight-başqa-iphone-lara-paylama)** — Apple Developer $99/il lazımdır.

## MVP qəbul kriteriyaları

- Owner login/logout
- Şirkətlər siyahısı
- Yeni şirkət + lisenziya kopyalama
- Aktiv/deaktiv
- Lisenziya regenerate (təsdiq modalı)
- Admin və kuryer hesabı yaratma
