/**
 * Minimal client-side decode of a Google ID-token (JWT) payload. We only read
 * non-sensitive profile claims (email, name) to seed the local account.
 *
 * NOTE: this does NOT verify the token's signature — that's fine here because
 * the token never leaves the client and grants nothing on its own. A real
 * backend MUST verify the signature server-side before trusting any claim.
 */
export interface GoogleClaims {
  email?: string;
  name?: string;
  sub?: string;
}

export function decodeGoogleJwt(credential: string): GoogleClaims {
  try {
    const payload = credential.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as GoogleClaims;
  } catch {
    return {};
  }
}
