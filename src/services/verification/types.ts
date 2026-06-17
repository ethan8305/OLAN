/**
 * ============================================================================
 *  THE VERIFICATION SEAM — the single most important boundary in this app.
 * ============================================================================
 *
 * CORE PRINCIPLE: every point comes from a VERIFIED return. Never the honour
 * system. The app NEVER decides on its own that a return happened — it asks a
 * verification adapter, and only trusts a result of { valid: true }.
 *
 * Today the only adapter is a MOCK (mockRvmAdapter) that accepts a scanned code
 * or a simulated RVM confirmation. Tomorrow this exact interface is implemented
 * by the real Return Right / Rehub confirmation API. Because everything upstream
 * (points, streaks, stats) depends ONLY on this interface — never on the mock's
 * internals — swapping in the real backend is a one-line change in index.ts.
 *
 * Keep this file backend-agnostic. No React, no storage, no points logic here.
 */

import type { ContainerType } from '../../types/models';

/** What the caller hands the verifier. */
export interface VerifyReturnInput {
  /**
   * The proof-of-return payload. For the mock this is a scanned QR/barcode
   * string or an RVM session token. For the real adapter it will be whatever
   * Return Right / Rehub issues at the point of return (receipt id, signed
   * token, deep-link callback param, etc.).
   */
  code: string;
  /** The user attempting to claim the return (identity == anti-fraud). */
  userId: string;
}

/** The verifier's verdict. This is the ONLY thing the rest of the app trusts. */
export interface VerifyReturnResult {
  /** True only if the backend confirmed a real, refundable return. */
  valid: boolean;
  /** Null when invalid. */
  containerType: ContainerType | null;
  /** ISO timestamp of the confirmed return (from the source of truth). */
  timestamp: string;
  /**
   * Stable reference to the verified return for audit / de-duplication. Real
   * adapters MUST guarantee a given physical return resolves to one ref so the
   * same return can't be claimed twice.
   */
  verificationRef: string;
  /** Human-readable reason, shown to the user when valid === false. */
  reason?: string;
}

/**
 * The contract every verification backend implements.
 * Implementations live next to this file; the chosen one is exported from
 * ./index.ts so callers do `import { verifyReturn } from '.../verification'`.
 */
export interface VerificationAdapter {
  verifyReturn(input: VerifyReturnInput): Promise<VerifyReturnResult>;
}
