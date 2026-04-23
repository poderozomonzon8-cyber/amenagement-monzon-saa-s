// OAuth Configuration Helper

export const oauthConfig = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    scope: 'email profile',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  apple: {
    teamId: process.env.APPLE_TEAM_ID,
    keyId: process.env.APPLE_KEY_ID,
    clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID,
    privateKey: process.env.APPLE_PRIVATE_KEY,
    scope: 'email name',
    authUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
  },
}

export function getGoogleAuthUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: oauthConfig.google.clientId || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: oauthConfig.google.scope,
    prompt: 'consent',
  })
  return `${oauthConfig.google.authUrl}?${params.toString()}`
}

export function getAppleAuthUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: oauthConfig.apple.clientId || '',
    redirect_uri: redirectUri,
    response_type: 'code id_token',
    scope: oauthConfig.apple.scope,
    response_mode: 'form_post',
  })
  return `${oauthConfig.apple.authUrl}?${params.toString()}`
}

export function isGoogleConfigured(): boolean {
  return !!(oauthConfig.google.clientId && oauthConfig.google.clientSecret)
}

export function isAppleConfigured(): boolean {
  return !!(
    oauthConfig.apple.clientId &&
    oauthConfig.apple.teamId &&
    oauthConfig.apple.keyId &&
    oauthConfig.apple.privateKey
  )
}
