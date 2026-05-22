# Öz logonuz (app ikonu)

## 1) Logo faylını hazırlayın

| Tələb | Dəyər |
|--------|--------|
| Format | **PNG** (şəffaf fon yaxşıdır) |
| Ölçü | **1024 × 1024** piksel (kvadrat) |
| Ad | Fayl adı məhz: **`icon.png`** |

**Android “adaptive icon”:** Loqo kənarlardan bir az kəsilməsin deyə, vacib hissəni mərkəzdə saxlayın (təxminən orta 66% dairə).

## 2) Bu qovluğa qoyun

Logonuzu kopyalayın:

```
/Users/elcan/owner-suman/assets/icon.png
```

Finder: layihə → `assets` → mövcud `icon.png`-nin **üstünə yazın** (əvəz edin).

## 3) Terminal

Layihə qovluğunda:

```bash
npm run mobile:icons
npm run mobile:android:sync
```

Bu əmr Android + iOS + splash üçün bütün ölçüləri yenidən yaradır.

## 4) Yeni APK

Android Studio → **Build → Build APK(s)**  
(Köhnə APK-nı Drive-da saxlasanız belə, yeni build-də yeni ikon olacaq.)

---

## Opsional

- **`icon-background.png`** (1024×1024) — yalnız Android fon rəngi/şəkli (yoxdursa `#0b6e99` istifadə olunur)
- Logo **şəffaf PNG** deyilsə, kvadrat dolu fon da olar

## Kömək

Logo faylınız hazırdırsa, Cursor-da `assets/icon.png` yerinə əlavə edib «ikonları yenilə» deyə bilərsiniz.
