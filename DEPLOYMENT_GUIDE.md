# Deployment Guide for Aménagement Monzon SaaS

## Overview
This guide covers deploying the application to Vercel with full authentication support (Email, Google OAuth, Apple OAuth, Magic Links).

## Prerequisites
- Vercel account
- Neon database project
- Google Cloud Console project
- Apple Developer account

---

## 1. Vercel Deployment

### Step 1: Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select framework: Next.js

### Step 2: Configure Environment Variables
In Vercel Project Settings → Environment Variables, add:

```
# Database
POSTGRES_URLDB=your_neon_connection_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Apple OAuth
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY=your_apple_private_key_base64
APPLE_CLIENT_ID=com.amenagementmonzon.app
NEXT_PUBLIC_APPLE_CLIENT_ID=com.amenagementmonzon.app

# Email
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@amenagementmonzon.com

# App URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Aménagement Monzon
```

### Step 3: Deploy
1. Click "Deploy"
2. Vercel automatically builds and deploys on push to main

---

## 2. Google OAuth Configuration

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: "Aménagement Monzon"
3. Enable Google+ API

### Step 2: Create OAuth Credentials
1. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
2. Application type: Web Application
3. Authorized JavaScript origins:
   - `https://your-domain.com`
   - `https://localhost:3000`
4. Authorized redirect URIs:
   - `https://your-domain.com/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`

### Step 3: Copy Credentials
- Copy Client ID → `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID`
- Copy Client Secret → `GOOGLE_CLIENT_SECRET`

---

## 3. Apple OAuth Configuration

### Step 1: Create Apple App ID
1. Go to [Apple Developer](https://developer.apple.com)
2. Certificates, Identifiers & Profiles → Identifiers
3. Click "+" → Select "App IDs"
4. Register: `com.amenagementmonzon.app`
5. Enable "Sign in with Apple"

### Step 2: Create Service ID
1. Identifiers → Service IDs → "+"
2. Identifier: `com.amenagementmonzon.service`
3. Configure domains:
   - Primary: `your-domain.com`
   - Return URLs: `https://your-domain.com/api/auth/callback/apple`

### Step 3: Create Private Key
1. Keys → "+"
2. Enable "Sign in with Apple"
3. Download the .p8 file (save securely)
4. Convert to base64:
   ```bash
   cat AuthKey_KEYID.p8 | base64
   ```
5. Copy output → `APPLE_PRIVATE_KEY`

### Step 4: Get Apple Credentials
- Team ID (from Membership) → `APPLE_TEAM_ID`
- Key ID (from downloaded file name) → `APPLE_KEY_ID`
- Client ID: `com.amenagementmonzon.app` → `APPLE_CLIENT_ID`

---

## 4. Email Magic Links (Resend)

### Step 1: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up with your email

### Step 2: Get API Key
1. Dashboard → API Keys
2. Copy your API key → `RESEND_API_KEY`

---

## 5. Database Setup

### Step 1: Neon Project
1. Go to [neon.tech](https://neon.tech)
2. Create project: "amenagement-monzon"
3. Copy connection string → `POSTGRES_URLDB`

### Step 2: Run Migrations
The database tables are automatically created on first app load through the SQL migrations.

---

## 6. Admin Account Setup

### First Time Setup
1. Deploy to Vercel
2. Access your app
3. Go to `/api/setup-admin`
4. Admin account created:
   - **Email**: silvio.l.monzon@hotmail.com
   - **Password**: Cronos1997!
   - **Role**: admin

---

## 7. Testing Authentication

### Email/Password Login
1. Go to login page
2. Enter: `silvio.l.monzon@hotmail.com`
3. Enter password: `Cronos1997!`
4. Should redirect to dashboard

### Google Login (Local Testing)
1. Click "Sign in with Google"
2. Select your Google account
3. Should redirect to dashboard

### Apple Login (Local Testing)
1. Click "Sign in with Apple"
2. Use Apple ID credentials
3. Should redirect to dashboard

### Magic Link Login
1. Enter email address
2. Check email for magic link
3. Click link to sign in

---

## 8. Custom Domain Setup

### Add Domain to Vercel
1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., admin.amenagementmonzon.com)
3. Update DNS records as shown

### Update OAuth Redirect URIs
After domain is live, update all OAuth redirect URIs to match your domain

---

## 9. Production Checklist

- [ ] All environment variables configured in Vercel
- [ ] Database connection working
- [ ] Google OAuth credentials added
- [ ] Apple OAuth credentials added
- [ ] Resend API key configured
- [ ] Custom domain added
- [ ] Admin account tested
- [ ] All login methods tested
- [ ] Email functionality tested

---

## 10. Troubleshooting

### "OAuth not configured" Error
- Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in Vercel env vars
- Check `NEXT_PUBLIC_APP_URL` matches your domain

### Password Login failing
- Run `/api/setup-admin` to ensure admin account exists
- Check password hash in database: `SELECT email, password_hash FROM users`

### Google callback error
- Verify redirect URI exactly matches OAuth configuration
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

### Apple callback error
- Verify `.p8` private key is valid
- Ensure `APPLE_TEAM_ID` and `APPLE_KEY_ID` match your credentials
- Check domain is verified in Apple Developer

---

## Support
For issues, check the database logs and Vercel deployment logs for detailed error messages.
