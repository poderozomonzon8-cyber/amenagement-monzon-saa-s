# Quick Start: Google & Apple OAuth Setup

## For Local Development

### 1. Google Setup (5 minutes)
```bash
# Visit: https://console.cloud.google.com
# 1. Create Project → "Aménagement Monzon"
# 2. Enable Google+ API
# 3. Create OAuth 2.0 Client ID (Web Application)
# 4. Add redirect: http://localhost:3000/api/auth/callback/google
# 5. Copy Client ID & Secret

# Create .env.local:
echo 'GOOGLE_CLIENT_ID=your_id_here' >> .env.local
echo 'GOOGLE_CLIENT_SECRET=your_secret_here' >> .env.local
echo 'NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id_here' >> .env.local
```

### 2. Apple Setup (10 minutes)
```bash
# Visit: https://developer.apple.com
# 1. Create App ID: com.amenagementmonzon.app
# 2. Create Service ID: com.amenagementmonzon.service
# 3. Add redirect: http://localhost:3000/api/auth/callback/apple
# 4. Create Private Key (.p8) → Download
# 5. Get Team ID from Membership

# Convert private key to base64:
cat AuthKey_KEYID.p8 | base64 > key.txt

# Add to .env.local:
echo 'APPLE_CLIENT_ID=com.amenagementmonzon.app' >> .env.local
echo 'NEXT_PUBLIC_APPLE_CLIENT_ID=com.amenagementmonzon.app' >> .env.local
echo 'APPLE_TEAM_ID=your_team_id' >> .env.local
echo 'APPLE_KEY_ID=your_key_id' >> .env.local
echo 'APPLE_PRIVATE_KEY=base64_content_here' >> .env.local
```

### 3. Test Locally
```bash
npm run dev
# Go to http://localhost:3000/auth/login
# Test each login method
```

---

## For Vercel Production

### 1. Deploy to Vercel
```bash
# Push to GitHub
git add .
git commit -m "Add Google & Apple OAuth"
git push origin main

# Vercel auto-deploys from main branch
# Get your production URL: https://your-project.vercel.app
```

### 2. Update OAuth Redirect URIs

**Google Cloud:**
- Add: `https://your-domain.com/api/auth/callback/google`

**Apple Developer:**
- Primary domain: `your-domain.com`
- Return URL: `https://your-domain.com/api/auth/callback/apple`

### 3. Add to Vercel Environment Variables
Go to Vercel Dashboard → Settings → Environment Variables:

```
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id

APPLE_CLIENT_ID=com.amenagementmonzon.app
NEXT_PUBLIC_APPLE_CLIENT_ID=com.amenagementmonzon.app
APPLE_TEAM_ID=your_team_id
APPLE_KEY_ID=your_key_id
APPLE_PRIVATE_KEY=base64_content

POSTGRES_URLDB=your_neon_connection
RESEND_API_KEY=your_resend_key
EMAIL_FROM=noreply@amenagementmonzon.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 4. Test in Production
1. Go to `https://your-domain.com/auth/login`
2. Test all login methods
3. Verify redirect to `/dashboard`

---

## Admin Account

**Email:** silvio.l.monzon@hotmail.com  
**Password:** Cronos1997!

Login at: `/auth/login`

---

## Files to Reference

- **AUTH_SETUP.md** - Detailed authentication documentation
- **DEPLOYMENT_GUIDE.md** - Full Vercel deployment guide
- **app/actions/auth.ts** - All authentication logic
- **app/auth/login/page.tsx** - Login UI with all methods
- **lib/oauth-config.ts** - OAuth configuration helpers

---

## One-Click Deployment Button

Coming soon! Will auto-configure Vercel with all OAuth providers.
