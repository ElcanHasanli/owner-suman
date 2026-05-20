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

`.env.local` faylında API ünvanını təyin edin:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

Production:

```env
NEXT_PUBLIC_API_URL=https://api.suman.khamsacraft.az
```

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

## MVP qəbul kriteriyaları

- Owner login/logout
- Şirkətlər siyahısı
- Yeni şirkət + lisenziya kopyalama
- Aktiv/deaktiv
- Lisenziya regenerate (təsdiq modalı)
- Admin və kuryer hesabı yaratma
