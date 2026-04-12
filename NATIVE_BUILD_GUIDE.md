# TipTracker Pro — Native App Build Guide

Build and submit TipTracker Pro to the Apple App Store and Google Play Store.

## Prerequisites

| Platform | Requirements |
|----------|-------------|
| **iOS** | macOS, Xcode 15+, CocoaPods, Apple Developer Account ($99/year) |
| **Android** | Android Studio, Android SDK, Google Play Console ($25 one-time) |
| **Both** | Node.js 18+, Git |

## Quick Start

```bash
# 1. Clone your repo from GitHub
git clone <your-repo-url>
cd <your-repo>

# 2. Install dependencies
npm install

# 3. Build the web app
npx vite build

# 4. Add native platforms
npx cap add ios
npx cap add android

# 5. Sync web assets to native projects
npx cap sync

# 6. Open in IDE
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio
```

Or use the helper script: `./scripts/capacitor-build.sh`

## iOS — App Store Submission

### 1. Configure Signing
- Open `ios/App/App.xcworkspace` in Xcode
- Select the **App** target → **Signing & Capabilities**
- Set your **Team** (Apple Developer account)
- Set **Bundle Identifier** to `com.tiptrackerpro.app`

### 2. Set App Icons
- Replace icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- Need a 1024×1024 source icon — use a tool like [AppIcon.co](https://appicon.co)

### 3. Build & Archive
- Select **Any iOS Device** as the target
- **Product → Archive**
- In the Organizer, click **Distribute App → App Store Connect**

### 4. App Store Connect
- Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
- Create a new app with bundle ID `com.tiptrackerpro.app`
- Fill in app metadata, screenshots, description
- Submit for review

## Android — Play Store Submission

### 1. Set App Icons
- Replace icons in `android/app/src/main/res/mipmap-*` folders
- Use [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/) to generate all sizes

### 2. Generate Signed APK/AAB
- In Android Studio: **Build → Generate Signed Bundle/APK**
- Choose **Android App Bundle (AAB)** for Play Store
- Create or use an existing keystore
- Build the release AAB

### 3. Google Play Console
- Go to [play.google.com/console](https://play.google.com/console)
- Create a new app
- Upload the AAB under **Production → Create new release**
- Fill in store listing, screenshots, content rating
- Submit for review

## Updating the App

After making changes in Lovable:

```bash
git pull                # Get latest changes
npx vite build          # Rebuild web app
npx cap sync            # Sync to native projects
npx cap open ios        # or android — rebuild in IDE
```

## Environment Variables

For production builds, make sure your `.env.production` has the correct values:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_PAYMENTS_CLIENT_TOKEN` (live Stripe key)

## App Store Guidelines Tips

- **Apple**: Ensure your app provides enough native functionality beyond a simple web wrapper. Add native features like push notifications or biometric auth to strengthen your case.
- **Google**: Similar guidelines apply. Ensure the app provides value beyond what a mobile website offers.
- Both stores require a **Privacy Policy URL** — your app already has one at `/privacy`.

## Troubleshooting

| Issue | Solution |
|-------|---------|
| White screen on app launch | Check `webDir` in `capacitor.config.ts` matches build output |
| API calls failing | Ensure your Supabase URL is in the allowed origins |
| iOS build fails | Run `cd ios/App && pod install` then retry |
| Android build fails | Sync Gradle files in Android Studio |
