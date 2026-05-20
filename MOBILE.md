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

Terminal (debug, Android Studio olmadan):

```bash
cd android && ./gradlew assembleDebug
```

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

## Qeydlər

- İlk açılış üçün **internet** lazımdır.
- Owner token `localStorage`-dadır (veb ilə eyni).
- Play Store / App Store üçün privacy policy və app təsviri tələb oluna bilər (WebView əsaslı admin panel).
