# Authentication System Setup

## Overview
This application supports four authentication methods:
1. Email & Password (traditional login)
2. Magic Links (passwordless email login)
3. Google OAuth
4. Apple OAuth

All credentials are securely stored in Neon PostgreSQL with bcrypt password hashing.

---

## Admin Account

**Pre-configured credentials:**
- Email: `silvio.l.monzon@hotmail.com`
- Password: `Cronos1997!`
- Role: `admin`

### Testing Login
1. Go to `https://your-domain.com/auth/login`
2. Select "Email & Password"
3. Enter credentials
4. Click "Sign In"
5. Redirected to `/dashboard` on success

---

## Magic Link Authentication

### How It Works
1. User enters email on login page
2. System generates unique token (valid for 24 hours)
3. Magic link sent via email
4. User clicks link → automatically signed in
5. Session created with HTTP-only cookie

### Testing Magic Links
1. Click "Send Magic Link" on login page
2. Enter any email address
3. Check email for link (uses Resend service)
4. Click link to sign in
5. If email doesn't exist, account created automatically

**Requirements:**
- `RESEND_API_KEY` configured in env vars
- `EMAIL_FROM` configured (e.g., noreply@amenagementmonzon.com)

---

## Google OAuth

### Configuration Steps

**1. Create Google Cloud Project**
- Go to [Google Cloud Console](https://console.cloud.google.com)
- New project → Name: "Aménagement Monzon"
- Enable Google+ API

**2. Create OAuth Credentials**
- Credentials → Create → OAuth 2.0 Client ID
- Application type: Web
- Authorized JavaScript origins:
  ```
  https://your-domain.com
  http://localhost:3000
  ```
- Authorized redirect URIs:
  ```
  https://your-domain.com/api/auth/callback/google
  http://localhost:3000/api/auth/callback/google
  ```

**3. Copy to Environment Variables**
```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
```

### Testing Locally
```bash
# Set env vars in .env.local
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx

# Start dev server
npm run dev

# Go to http://localhost:3000/auth/login
# Click "Sign in with Google"
# Sign in with your Google account
```

---

## Apple OAuth

### Configuration Steps

**1. Create Apple App ID**
- Go to [Apple Developer](https://developer.apple.com)
- Certificates, Identifiers & Profiles → Identifiers
- Click "+" → App IDs
- Create new: `com.amenagementmonzon.app`
- Enable "Sign in with Apple"

**2. Create Service ID**
- Identifiers → Service IDs → "+"
- Identifier: `com.amenagementmonzon.service`
- Configure domains:
  - Primary domain: `your-domain.com`
  - Return URLs:
    ```
    https://your-domain.com/api/auth/callback/apple
    http://localhost:3000/api/auth/callback/apple
    ```

**3. Create Private Key (.p8 file)**
- Keys → "+"
- Enable "Sign in with Apple"
- Download .p8 file (store securely)

**4. Convert Private Key to Base64**
```bash
# macOS/Linux
cat AuthKey_KEYID.p8 | base64

# Windows (PowerShell)
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("AuthKey_KEYID.p8"))
```

**5. Copy to Environment Variables**
```env
APPLE_TEAM_ID=your_team_id_here
APPLE_KEY_ID=your_key_id_here
APPLE_PRIVATE_KEY=base64_encoded_private_key
APPLE_CLIENT_ID=com.amenagementmonzon.app
NEXT_PUBLIC_APPLE_CLIENT_ID=com.amenagementmonzon.app
```

### Finding Your Apple Credentials
- **Team ID**: Apple Developer → Membership
- **Key ID**: Filename of downloaded .p8 (e.g., `AuthKey_ABC123DEF.p8` → Key ID is `ABC123DEF`)
- **Private Key**: Content of .p8 file (base64 encoded)

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'client',
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### OAuth Accounts Table
```sql
CREATE TABLE oauth_accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  provider VARCHAR(50),           -- 'google' or 'apple'
  provider_user_id VARCHAR(255),
  email VARCHAR(255),
  name VARCHAR(255),
  image_url TEXT,
  created_at TIMESTAMP,
  UNIQUE(provider, provider_user_id)
);
```

### Magic Links Table
```sql
CREATE TABLE email_magic_links (
  id UUID PRIMARY KEY,
  email VARCHAR(255),
  token VARCHAR(255) UNIQUE,
  expires_at TIMESTAMP,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP,
  created_at TIMESTAMP
);
```

---

## Session Management

### How Sessions Work
1. After successful login, session token created in database
2. Token sent as HTTP-only cookie (secure, httpOnly, sameSite=Lax)
3. Cookie automatically included with requests
4. Token verified on protected routes
5. Session expires after 7 days (configurable)

### Logout
```typescript
// Server action in app/actions/auth.ts
export async function logout() {
  // Clears session cookie
}
```

---

## Password Security

### Bcrypt Hashing
- Passwords hashed with bcrypt ($2a$12$ algorithm)
- Never stored in plain text
- Cost factor: 12 (secure against brute force)

### Changing Password
```typescript
// User can update password in settings
// Old password verified with bcrypt
// New password hashed before storage
```

---

## Role-Based Access Control

### Roles
- **admin**: Full access to dashboard, CMS, leads, settings
- **client**: Limited access to own projects/submissions
- **guest**: No access (redirected to login)

### Route Protection
```typescript
// In middleware or route handlers
if (user.role !== 'admin') {
  return NextResponse.redirect('/unauthorized')
}
```

---

## Vercel Deployment Checklist

- [ ] All environment variables added to Vercel
- [ ] Google OAuth redirect URIs updated
- [ ] Apple OAuth service ID domain verified
- [ ] Neon database connection tested
- [ ] Admin account created
- [ ] Email provider configured (Resend)
- [ ] Custom domain added
- [ ] SSL certificate auto-generated
- [ ] All login methods tested

---

## Troubleshooting

### "Email or password is incorrect"
- Verify email is registered in users table
- Check bcrypt hash is correct
- Try magic link instead

### Google login redirects to error page
- Verify `GOOGLE_CLIENT_ID` matches Google Cloud
- Check redirect URI exactly matches configuration
- Ensure both `GOOGLE_CLIENT_ID` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` set

### Apple login fails
- Verify `.p8` private key is valid (not expired)
- Check base64 encoding of private key
- Ensure `APPLE_TEAM_ID` and `APPLE_KEY_ID` correct
- Verify service ID domain is registered

### Magic link not sending
- Check `RESEND_API_KEY` is valid
- Verify `EMAIL_FROM` is verified in Resend
- Check email address is in correct format

### Session cookie not set
- Verify HTTPS in production (HTTP-only cookies require HTTPS)
- Check cookie domain matches request origin
- Clear browser cookies and retry

---

## Security Best Practices

1. **Never commit secrets** - Use .env.local for local development
2. **HTTPS only** - OAuth callbacks must use HTTPS in production
3. **Token expiration** - Sessions expire after 7 days
4. **HTTP-only cookies** - Can't be accessed by JavaScript
5. **CSRF protection** - Built into Next.js
6. **Input validation** - All inputs validated before processing
7. **Rate limiting** - Implement on magic link endpoint to prevent abuse

---

## Testing OAuth Locally

### Step 1: Set Environment Variables
Create `.env.local`:
```env
POSTGRES_URLDB=your_neon_connection
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
APPLE_CLIENT_ID=com.amenagementmonzon.app
NEXT_PUBLIC_APPLE_CLIENT_ID=com.amenagementmonzon.app
```

### Step 2: Update OAuth Redirect URIs
In Google Cloud and Apple Developer:
- Add: `http://localhost:3000/api/auth/callback/google`
- Add: `http://localhost:3000/api/auth/callback/apple`

### Step 3: Start Dev Server
```bash
npm run dev
```

### Step 4: Test Login
1. Go to `http://localhost:3000/auth/login`
2. Try each method:
   - Email & Password: `silvio.l.monzon@hotmail.com` / `Cronos1997!`
   - Magic Link: Enter any email
   - Google: Click button
   - Apple: Click button

---

## Support

For issues:
1. Check console logs for detailed errors
2. Verify all environment variables are set
3. Check database connection with Neon dashboard
4. Review OAuth callback logs in Google Cloud / Apple Developer
5. Test with different browsers/devices
