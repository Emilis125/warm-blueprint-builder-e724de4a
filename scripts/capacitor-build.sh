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
