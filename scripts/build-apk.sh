#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -d "/Applications/Android Studio.app/Contents/jbr/Contents/Home" ]]; then
  export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
elif [[ -z "${JAVA_HOME:-}" ]]; then
  echo "JAVA_HOME tapılmadı. Android Studio quraşdırın və ya JDK təyin edin."
  exit 1
fi

SDK_DIR="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Library/Android/sdk}}"
LOCAL_PROPS="$ROOT/android/local.properties"
if [[ ! -f "$LOCAL_PROPS" ]] || ! grep -q "sdk.dir=" "$LOCAL_PROPS" 2>/dev/null; then
  if [[ -d "$SDK_DIR" ]]; then
    echo "sdk.dir=$SDK_DIR" >"$LOCAL_PROPS"
    echo "→ android/local.properties yaradıldı"
  else
    echo "Android SDK tapılmadı: $SDK_DIR"
    echo "Android Studio açın → SDK Manager → SDK yolu, sonra local.properties yazın."
    exit 1
  fi
fi
export ANDROID_HOME="$SDK_DIR"

echo "→ Capacitor sync..."
npm run mobile:android:sync

echo "→ APK build (debug)..."
cd android
./gradlew assembleDebug

APK="app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "✓ Hazırdır:"
echo "  $ROOT/android/$APK"
ls -lh "$APK"
