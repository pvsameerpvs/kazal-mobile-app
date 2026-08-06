export const AUTH_CALLBACK_PATH = '/auth/callback';

export const GOOGLE_OAUTH_PARAMS: Record<string, string> = {
  prompt: 'consent',
  access_type: 'offline',
};

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  access_denied: 'Google sign-in was cancelled.',
  invalid_request: 'The sign-in request was invalid. Please try again.',
  server_error: 'Google sign-in is unavailable right now. Please try again.',
  no_session_url: 'Unable to start Google sign-in. Please try again.',
  no_auth_code: 'Google returned no verification code. Please try again.',
  exchange_failed: 'Unable to complete sign-in. Please try again.',
  not_configured: 'Sign-in is not configured yet. Please check back soon.',
};
