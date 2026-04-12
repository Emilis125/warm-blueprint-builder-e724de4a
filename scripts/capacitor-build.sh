#!/bin/bash
# TipTracker Pro — Capacitor Build Script
# Run this on your local machine after cloning the repo.
#
# Prerequisites:
#   - Node.js 18+
#   - For iOS: macOS + Xcode 15+ + CocoaPods
#   - For Android: Android Studio + Android SDK
#
# Usage:
#   chmod +x scripts/capacitor-build.sh
#   ./scripts/capacitor-build.sh

set -e

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building web app..."
npx vite build

echo "📱 Adding native platforms..."
# Only add if not already present
if [ ! -d "ios" ]; then
  npx cap add ios
  echo "✅ iOS platform added"
fi

if [ ! -d "android" ]; then
  npx cap add android
  echo "✅ Android platform added"
fi

echo "🎨 Copying app icons..."

# --- Android icons ---
ANDROID_RES="android/app/src/main/res"
if [ -d "$ANDROID_RES" ]; then
  for density in mipmap-mdpi mipmap-hdpi mipmap-xhdpi mipmap-xxhdpi mipmap-xxxhdpi; do
    if [ -d "resources/android/$density" ]; then
      mkdir -p "$ANDROID_RES/$density"
      cp resources/android/$density/*.png "$ANDROID_RES/$density/"
    fi
  done
  echo "✅ Android icons copied"
fi

# --- iOS icons ---
IOS_ICONSET="ios/App/App/Assets.xcassets/AppIcon.appiconset"
if [ -d "$IOS_ICONSET" ]; then
  cp resources/ios/*.png "$IOS_ICONSET/"
  # Generate Contents.json for iOS
  cat > "$IOS_ICONSET/Contents.json" << 'EOFJSON'
{
  "images": [
    { "filename": "AppIcon-1024x1024@1x.png", "idiom": "universal", "platform": "ios", "size": "1024x1024" },
    { "filename": "AppIcon-76x76@1x.png", "idiom": "ipad", "scale": "1x", "size": "76x76" },
    { "filename": "AppIcon-152x152@1x.png", "idiom": "ipad", "scale": "2x", "size": "76x76" },
    { "filename": "AppIcon-40x40@1x.png", "idiom": "ipad", "scale": "1x", "size": "40x40" },
    { "filename": "AppIcon-80x80@1x.png", "idiom": "ipad", "scale": "2x", "size": "40x40" },
    { "filename": "AppIcon-167x167@1x.png", "idiom": "ipad", "scale": "2x", "size": "83.5x83.5" },
    { "filename": "AppIcon-20x20@1x.png", "idiom": "ipad", "scale": "1x", "size": "20x20" },
    { "filename": "AppIcon-40x40@1x.png", "idiom": "ipad", "scale": "2x", "size": "20x20" },
    { "filename": "AppIcon-29x29@1x.png", "idiom": "ipad", "scale": "1x", "size": "29x29" },
    { "filename": "AppIcon-58x58@1x.png", "idiom": "ipad", "scale": "2x", "size": "29x29" },
    { "filename": "AppIcon-60x60@1x.png", "idiom": "iphone", "scale": "2x", "size": "30x30" },
    { "filename": "AppIcon-120x120@1x.png", "idiom": "iphone", "scale": "2x", "size": "60x60" },
    { "filename": "AppIcon-180x180@1x.png", "idiom": "iphone", "scale": "3x", "size": "60x60" },
    { "filename": "AppIcon-80x80@1x.png", "idiom": "iphone", "scale": "2x", "size": "40x40" },
    { "filename": "AppIcon-120x120@1x.png", "idiom": "iphone", "scale": "3x", "size": "40x40" },
    { "filename": "AppIcon-40x40@1x.png", "idiom": "iphone", "scale": "2x", "size": "20x20" },
    { "filename": "AppIcon-60x60@1x.png", "idiom": "iphone", "scale": "3x", "size": "20x20" },
    { "filename": "AppIcon-58x58@1x.png", "idiom": "iphone", "scale": "2x", "size": "29x29" },
    { "filename": "AppIcon-87x87@1x.png", "idiom": "iphone", "scale": "3x", "size": "29x29" }
  ],
  "info": { "author": "xcode", "version": 1 }
}
EOFJSON
  echo "✅ iOS icons copied"
fi

echo "🔄 Syncing web assets to native projects..."
npx cap sync

echo ""
echo "✅ Build complete!"
echo ""
echo "Next steps:"
echo "  iOS:     npx cap open ios     → Build & run in Xcode"
echo "  Android: npx cap open android → Build & run in Android Studio"
echo ""
echo "To submit to stores:"
echo "  iOS:     Archive in Xcode → Upload to App Store Connect"
echo "  Android: Build → Generate Signed APK/AAB → Upload to Google Play Console"
