# Google Authentication Setup Guide

## Overview
This guide will help you configure Google authentication for the ByteBank app. The app uses a dual approach for maximum compatibility:
1. **Native Google Sign-In** (@react-native-google-signin/google-signin) - Better UX
2. **Expo AuthSession** - Fallback for compatibility

## Prerequisites
- Google Cloud Console access
- Firebase project (projeto-bytebank)
- Expo CLI installed

## Step 1: Google Cloud Console Setup

### 1.1 Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `projeto-bytebank`
3. Navigate to **APIs & Services** > **Credentials**

### 1.2 Enable Required APIs
1. Go to **APIs & Services** > **Library**
2. Enable the following APIs:
   - Google Sign-In API
   - Google+ API (if available)
   - People API

### 1.3 Create OAuth 2.0 Client IDs

You need to create **4 different OAuth 2.0 Client IDs**:

#### A. Web Client ID (Required for Firebase)
1. Click **Create Credentials** > **OAuth 2.0 Client ID**
2. Application type: **Web application**
3. Name: `ByteBank Web Client`
4. Authorized origins: 
   - `http://localhost:3000`
   - `https://your-domain.com` (if you have one)
5. Authorized redirect URIs:
   - `http://localhost:3000`
   - `https://your-domain.com` (if you have one)
6. Save the **Client ID** - you'll need this for `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

#### B. Android Client ID
1. Click **Create Credentials** > **OAuth 2.0 Client ID**
2. Application type: **Android**
3. Name: `ByteBank Android`
4. Package name: `com.bytebank.app`
5. SHA-1 certificate fingerprint:
   - For development: Get from `expo credentials:manager`
   - For production: Get from your keystore
6. Save the **Client ID** - you'll need this for `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`

#### C. iOS Client ID
1. Click **Create Credentials** > **OAuth 2.0 Client ID**
2. Application type: **iOS**
3. Name: `ByteBank iOS`
4. Bundle ID: `com.bytebank.app`
5. Save the **Client ID** - you'll need this for `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`

#### D. Expo Client ID (Optional)
1. Click **Create Credentials** > **OAuth 2.0 Client ID**
2. Application type: **Web application**
3. Name: `ByteBank Expo`
4. Authorized redirect URIs:
   - `https://auth.expo.io/@your-username/bytebank-app`
   - Any other Expo redirect URIs
5. Save the **Client ID** - you'll need this for `EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID`

## Step 2: Configure Environment Variables

Update your `.env` file with the Client IDs you created:

```env
# Replace these placeholder values with your actual Client IDs from Google Cloud Console

# For Expo Go development (optional)
EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID=102802199932-your-expo-client-id.apps.googleusercontent.com

# iOS Client ID (for standalone iOS builds)
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=102802199932-your-ios-client-id.apps.googleusercontent.com

# Android Client ID (for standalone Android builds)
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=102802199932-your-android-client-id.apps.googleusercontent.com

# Web Client ID (required for Firebase Auth)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=102802199932-your-web-client-id.apps.googleusercontent.com
```

## Step 3: Download Google Services Files

### For Android
1. In Google Cloud Console, go to your Android OAuth client
2. Download the `google-services.json` file
3. Place it in the root of your project: `/google-services.json`

### For iOS
1. In Google Cloud Console, go to your iOS OAuth client
2. Download the `GoogleService-Info.plist` file
3. Place it in the root of your project: `/GoogleService-Info.plist`

## Step 4: Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `projeto-bytebank`
3. Go to **Authentication** > **Sign-in method**
4. Enable **Google** sign-in provider
5. Use the **Web Client ID** from Step 1.3.A

## Step 5: Test the Implementation

### Development Testing (Expo Go)
```bash
npm run start
```

### Production Testing (EAS Build)
```bash
# Android
npm run build:android:dev

# iOS  
npm run build:ios:dev
```

## Troubleshooting

### Common Issues

1. **"Google Client ID não configurado"**
   - Check that your `.env` file has the correct Client IDs
   - Restart the Expo development server

2. **"No ID token received from Google"**
   - Ensure the Web Client ID is correctly configured in Firebase
   - Check that Google Sign-In is enabled in Firebase Authentication

3. **"hasPlayServices failed"**
   - This is normal on iOS - the app will fallback to AuthSession
   - On Android, ensure Google Play Services are installed

4. **"Login Google cancelado"**
   - User cancelled the login process
   - Check that redirect URIs are correctly configured

### Debug Tips

1. Check the console logs for detailed error messages
2. Verify Client IDs match between Google Cloud Console and `.env`
3. Ensure bundle identifiers match exactly
4. Test on both development and production builds

## Security Notes

- Never commit actual Client IDs to version control
- Use different Client IDs for development and production
- Regularly rotate your Client IDs if compromised
- Keep your `google-services.json` and `GoogleService-Info.plist` files secure

## Additional Resources

- [Google Sign-In for React Native](https://github.com/react-native-google-signin/google-signin)
- [Expo AuthSession Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
