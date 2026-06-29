# SUMAN Owner — Mobil (Android APK + iOS)

Layihə **[Capacitor](https://capacitorjs.com)** ilə mobil qabıqdır: app açılanda production panel yüklənir:

**https://suman.khamsacraft.az**

API sorğuları vebdəki kimi **https://api.suman.khamsacraft.az** ünvanına gedir (panel deploy-da bu API ilə qurulmalıdır).

---

## Tələblər

| Platform | Lazım olan |
|----------|------------|
| **Android APK** | [Android Studio](https://developer.android.com/studio), JDK 17+ |
| **iOS** | macOS, [Xcode](https://developer.apple.com/xcode/) (yalnız Mac-də) |

```bash
npm install
npm run mobile:sync
```

---

## Android — APK qurmaq

### Android Studio quraşdırın (bir dəfə)

Terminaldə `Unable to launch Android Studio` görsəniz — Studio **quraşdırılmayıb**.

1. [developer.android.com/studio](https://developer.android.com/studio) — **Mac** üçün yükləyin
2. `.dmg` açıb **Android Studio**-nu **Applications**-a sürüşdürün
3. İlk açılışda **Standard** install (SDK + JDK daxil olur)
4. Sonra:

```bash
npm run mobile:android
```

(`cap sync` artıq işləyibsə, yalnız Studio açılır.)

Studio başqa yerdədirsə:

```bash
export CAPACITOR_ANDROID_STUDIO_PATH="/Applications/Android Studio.app"
npm run mobile:android
```

**Sync Studio olmadan** (layihəni yeniləmək):

```bash
npm run mobile:android:sync
```

**APK terminaldan** (Android Studio quraşdırılıbsa — bir əmr):

```bash
npm run mobile:apk
```

Hazır fayl: `android/app/build/outputs/apk/debug/app-debug.apk`

**`SDK location not found` xətası:** `android/local.properties` lazımdır:

```properties
sdk.dir=/Users/SIZIN_ADINIZ/Library/Android/sdk
```

və ya: `cp android/local.properties.example android/local.properties` və yolu düzəldin.

---

1. Android Studio açın:

```bash
npm run mobile:android
```

2. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. APK yolu (debug):

```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Release APK** (Play Store / paylanma):

- **Build → Generate Signed Bundle / APK**
- Keystore yaradın, `release` variant seçin

Terminal (debug, Android Studio olmadan, JDK lazımdır):

```bash
cd android && ./gradlew assembleDebug
```

### App ikonu dəyişmək

1. **1024×1024** PNG hazırlayın
2. Faylı `assets/icon.png` üzərinə yazın
3. Terminal:

```bash
npm run mobile:icons
npm run mobile:android:sync
```

4. Yenidən **Build APK** (köhnə APK-da köhnə ikon qalar)

İkon mənbəyi: `assets/README.md`

### Google Drive ilə APK paylama

1. **APK yaradın** (yuxarıdakı üsul) — fayl: `android/app/build/outputs/apk/debug/app-debug.apk`
2. [drive.google.com](https://drive.google.com) → **Yeni** → **Fayl yüklə** → `app-debug.apk` seçin
3. Yüklənən fayla sağ klik → **Paylaş** / **Share**
4. **Ümumi giriş** → **Linki olan hər kəs** (Viewer və ya Editor — Viewer kifayətdir)
5. **Linki kopyala** — WhatsApp, email və s. göndərin

**Testçi (Android telefon):**

1. Linki telefonda açın (Chrome)
2. APK **Yüklə** / Download
3. Bildirişdən və ya **Fayllar / Downloads**-dan `.apk` açın
4. İlk dəfə: **Settings → Security** (və ya **Install unknown apps**) → brauzer/Drive üçün quraşdırmaya icazə
5. **Quraşdır** → **SUMAN Owner** açılır (internet lazımdır)

> Drive bəzən APK-nı skan edir — bir neçə dəqiqə gözləyin. Link **“restricted”** olarsa, paylaşımı «Linki olan hər kəs» edin.

---

## iOS — iPhone / iPad

1. Mac-də:

```bash
npm run mobile:ios
```

2. Xcode-da **Team** (Apple Developer) seçin
3. Simulator və ya real cihazda **Run** (▶)
4. App Store üçün: **Product → Archive → Distribute**

> iOS build **yalnız macOS**-da mümkündür.

### iOS yeniləmə (öz telefonunuz)

Panel vebdədirsə (`suman.khamsacraft.az`) çox dəyişiklik üçün **yeni build lazım deyil**. Yeni build lazımdır: ikon, splash, app adı, native plugin.

```bash
npm run mobile:ios:update
```

Xcode-da:

1. **Any iOS Device (arm64)** və ya öz iPhone
2. **Product → Clean Build Folder** (⇧⌘K) — köhnə build qalıbsa
3. **▶ Run** (USB ilə telefon) — və ya **Product → Archive** (TestFlight)

Versiya: Xcode → **App** target → **General** → **Version** `1.0.1`, **Build** `2` (hər yeniləmədə Build artırın).

**TestFlight:** Archive → Distribute → App Store Connect → TestFlight-da yeni build seçin.

### Signing xətası (provisioning profile / no devices)

**Ən asan yol — Simulator (telefon lazım deyil):**

1. Yuxarıdakı cihaz siyahısından **iPhone 16 Simulator** (və ya başqa simulator) seçin — **öz iPhone adınız yox**, «Any iOS Device» yox.
2. **App** target → **Signing & Capabilities**
3. **Automatically manage signing** işarələ
4. **Team:** öz Apple ID-niz (**Personal Team** pulsuz hesab da olar)
5. **Bundle Identifier** unikal olsun, məs. `az.khamsacraft.suman.owner` və ya `com.sizinad.suman.owner`
6. **Run** (▶)

**Real iPhone-da test:**

1. iPhone USB ilə qoşun, «Trust This Computer»
2. Yuxarıdan **öz telefonunuzu** seçin (simulator yox)
3. Signing-də eyni **Team** + avtomatik signing — Xcode cihazı Apple hesabına əlavə edir
4. Telefonda: **Settings → General → VPN & Device Management** → developer app-ə trust

**«Communication with Apple failed»:**

- Xcode → **Settings** (⌘,) → **Accounts** → Apple ID → **Download Manual Profiles**
- Apple ID çıxıb yenidən daxil olun
- [developer.apple.com](https://developer.apple.com/account/) — müqavilə/ödəniş xəbərdarlığı varsa qəbul edin
- VPN söndürün, internet yoxlayın

**Profile tapılmır:** Layihədə başqa komandanın `DEVELOPMENT_TEAM` silinib — Xcode-da **öz Team**-inizi yenidən seçin.

---

## Panel URL dəyişmək

`capacitor.config.ts` içində `server.url` (default: `https://suman.khamsacraft.az`).

Müvəqqəti başqa ünvan:

```bash
CAPACITOR_SERVER_URL=https://baqa-domain.az npm run cap:sync
```

**Lokal Next.js** (Android emulator, host maşında `npm run dev`):

```bash
CAPACITOR_SERVER_URL=http://10.0.2.2:3000 npm run cap:sync
npm run mobile:android
```

(iOS simulator üçün adətən `http://localhost:3000` işləyir.)

---

## Yeniləmə

Panel vebdə deploy olunanda **APK yenidən build etməyə ehtiyac yoxdur** — app eyni URL-i açır, dəyişikliklər serverdən gəlir.

Yalnız app adı, ikon, splash, `appId` dəyişəndə `npm run cap:sync` və native build təkrarlayın.

---

## TestFlight (başqa iPhone-lara paylama)

**Personal Team (pulsuz) TestFlight vermir.** Lazımdır: [Apple Developer Program](https://developer.apple.com/programs/) — **$99/il**.

### Addım 1 — Apple Developer

1. [developer.apple.com/programs/enroll](https://developer.apple.com/programs/enroll) — qeydiyyat, ödəniş
2. Təsdiq olunana qədər gözləyin (adətən 24–48 saat)

### Addım 2 — App Store Connect

1. [appstoreconnect.apple.com](https://appstoreconnect.apple.com) → **Apps** → **+** → **New App**
2. Platform: **iOS**
3. **Bundle ID:** `az.khamsacraft.suman.owner` (Xcode ilə eyni olmalıdır)
   - Əgər siyahıda yoxdursa: [developer.apple.com/account/resources/identifiers](https://developer.apple.com/account/resources/identifiers) → **+** → App IDs → eyni ID yaradın
4. Ad: **SUMAN Owner**, dil, SKU (məs. `suman-owner-ios`)

### Addım 3 — Xcode-da Archive

```bash
cd /Users/elcan/owner-suman
npm run cap:sync
npm run mobile:ios
```

Xcode-da:

1. Yuxarıdan **Any iOS Device (arm64)** seçin (simulator yox)
2. **App** → **Signing & Capabilities**
   - Team: **ödənişli Developer Team** (Personal Team yox)
   - Bundle ID: `az.khamsacraft.suman.owner`
   - Automatically manage signing: işarəli
3. Menyu: **Product → Archive** (uğurlu build lazımdır)
4. Açılan **Organizer** pəncərəsində: **Distribute App**
5. **App Store Connect** → **Upload** → Next (default seçimlər) → Upload

Upload bitəndən sonra App Store Connect-də build görünməsi **5–30 dəqiqə** çəkə bilər («Processing»).

### Addım 4 — TestFlight testçilər

App Store Connect → app → **TestFlight**:

| Növ | Kim | Nə lazımdır |
|-----|-----|-------------|
| **Internal** | Komanda (App Store Connect istifadəçiləri) | Dərhal, ~100 nəfər |
| **External** | İstənilən Apple ID email | **Beta App Review** (1–2 gün), **Privacy Policy URL** |

**External testçi əlavə etmək:**

1. TestFlight → **External Testing** → **+** qrup
2. Build seçin (processing bitmiş)
3. **Test Information:** nə edir (məs. «Su çatdırılması platforması — owner idarəetmə paneli»)
4. **Privacy Policy URL** (məs. saytınızda sadə səhifə)
5. Testçi email-ləri əlavə edin → dəvət göndərilir
6. Testçi iPhone-da **TestFlight** app quraşdırıb linkdən qəbul edir

### Yeniləmə (yeni build)

Panel veb URL-dədirsə — çox vaxt **yeni build lazım deyil**. App ikonu / splash / Bundle ID dəyişəndə:

1. Xcode-da **Version** (`MARKETING_VERSION`) və ya **Build** (`CURRENT_PROJECT_VERSION`) artırın
2. Yenidən **Archive → Upload**
3. TestFlight-da yeni build-i qrupa təyin edin

### Tez-tez suallar

- **«No suitable application records»** — App Store Connect-də app + Bundle ID yaradılmayıb
- **Signing xətası Archive-da** — Team ödənişli Developer olmalıdır
- **Export compliance** — layihədə `ITSAppUsesNonExemptEncryption = false` (yalnız HTTPS)

---

## Qeydlər

- İlk açılış üçün **internet** lazımdır.
- Owner token `localStorage`-dadır (veb ilə eyni).
- Play Store / App Store üçün privacy policy və app təsviri tələb oluna bilər (WebView əsaslı admin panel).
