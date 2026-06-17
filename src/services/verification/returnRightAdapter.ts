/**
 * ============================================================================
 *  TODO — REAL VERIFICATION ADAPTER (Return Right / Rehub). NOT YET WIRED UP.
 * ============================================================================
 *
 * This is the plug point for production verification. When BCRS exposes a
 * confirmation API (or Rehub's RVM SDK / deep-link callback is available),
 * implement verifyReturn() here and swap the export in ./index.ts from
 * `mockRvmAdapter` to `returnRightAdapter`. Nothing else in the app changes.
 *
 * Implementation checklist for whoever picks this up:
 *   [ ] Authenticate the app to the Return Right / Rehub API.
 *   [ ] Exchange `input.code` (scanned QR / signed RVM token / callback param)
 *       for an authoritative confirmation. Do NOT trust the client.
 *   [ ] Map the source response to ContainerType.
 *   [ ] Return a STABLE verificationRef per physical return so the same return
 *       cannot be claimed twice (de-duplication is enforced server-side too).
 *   [ ] Bind the confirmation to input.userId / the verified phone identity.
 *   [ ] On any uncertainty, return { valid: false } — never award on doubt.
 */

import type {
  VerificationAdapter,
  VerifyReturnInput,
  VerifyReturnResult,
} from './types';

export const returnRightAdapter: VerificationAdapter = {
  async verifyReturn(_input: VerifyReturnInput): Promise<VerifyReturnResult> {
    // TODO: call the real Return Right / Rehub confirmation endpoint here.
    throw new Error(
      'returnRightAdapter is not implemented yet. The app currently uses mockRvmAdapter. ' +
        'See this file for the production wiring checklist.'
    );
  },
};
