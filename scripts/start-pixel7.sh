#!/usr/bin/env bash
set -euo pipefail

SDK_ROOT="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$HOME/Android/Sdk}}"
EMULATOR="$SDK_ROOT/emulator/emulator"
ADB="$SDK_ROOT/platform-tools/adb"
AVD_NAME="${AVD_NAME:-Pixel_7}"
DATA_IMG="${PIXEL7_DATA_IMG:-$HOME/.android/avd/kazal-pixel7-userdata.img}"
CACHE_IMG="${PIXEL7_CACHE_IMG:-$HOME/.android/avd/kazal-pixel7-cache.img}"
PARTITION_SIZE="${PIXEL7_PARTITION_SIZE:-12288}"
LOG_FILE="${PIXEL7_LOG_FILE:-/tmp/kazal-pixel7-emulator.log}"

if [[ ! -x "$EMULATOR" ]]; then
  echo "Android emulator binary not found: $EMULATOR" >&2
  exit 1
fi

if [[ ! -x "$ADB" ]]; then
  echo "adb binary not found: $ADB" >&2
  exit 1
fi

if "$ADB" devices | awk '$1 ~ /^emulator-/ && $2 == "device" { found = 1 } END { exit !found }'; then
  echo "$AVD_NAME is already running."
  "$ADB" devices -l
  exit 0
fi

echo "Starting $AVD_NAME..."
setsid -f "$EMULATOR" \
  -avd "$AVD_NAME" \
  -gpu swiftshader_indirect \
  -no-snapshot \
  -no-boot-anim \
  -data "$DATA_IMG" \
  -cache "$CACHE_IMG" \
  -partition-size "$PARTITION_SIZE" \
  >"$LOG_FILE" 2>&1

echo "Waiting for Android to boot..."
"$ADB" wait-for-device

deadline=$((SECONDS + 240))
until [[ "$("$ADB" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" == "1" ]]; do
  if (( SECONDS > deadline )); then
    echo "Timed out waiting for $AVD_NAME. Last emulator log lines:" >&2
    tail -80 "$LOG_FILE" >&2 || true
    exit 1
  fi
  sleep 2
done

"$ADB" shell input keyevent 82 >/dev/null 2>&1 || true
echo "$AVD_NAME is ready."
"$ADB" devices -l
