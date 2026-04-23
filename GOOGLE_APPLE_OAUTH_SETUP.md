# Google & Apple OAuth Setup Guide

## Quick Setup for Vercel Deployment

### Step 1: Get Your App URL
After deploying to Vercel, copy your production URL:
- Example: `https://amenagement-monzon.vercel.app`

### Step 2: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Select "Web application"
6. Add authorized redirect URIs:
   - `https://yourapp.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local testing)
7. Copy the **Client ID** and **Client Secret**

8. Add to Vercel Environment Variables:
   ```
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
   ```

### Step 3: Apple OAuth Setup

1. Go to [Apple Developer Account](https://developer.apple.com/)
2. Navigate to Certificates, Identifiers & Profiles
3. Create a new Service ID for your app
4. Configure Sign in with Apple:
   - Primary App ID: Your main app identifier
   - Return URLs: 
     - `https://yourapp.vercel.app/api/auth/callback/apple`
     - `http://localhost:3000/api/auth/callback/apple`

5. Create a Private Key (generate new key):
   - Download the key file (keep it safe)
   - Note the Key ID

6. Get your Team ID from Account settings

7. Add to Vercel Environment Variables:
   ```
   NEXT_PUBLIC_APPLE_CLIENT_ID=your-service-id
   APPLE_TEAM_ID=your-team-id
   APPLE_KEY_ID=your-key-id
   APPLE_PRIVATE_KEY=your-private-key-content
   NEXT_PUBLIC_APP_URL=https://yourapp.vercel.app
   ```

### Step 4: Deploy to Vercel

1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Testing Locally

If you have local env vars set, test at `http://localhost:3000/auth/login`

All three login methods will be available:
- ✅ Email & Password
- ✅ Magic Link (email)
- ✅ Google Sign-in
- ✅ Apple Sign-in
