/**
 * MOCK verification adapter — stands in for the BCRS RVM / Return Right backend
 * until the real one is wired up. It implements the exact VerificationAdapter
 * contract so nothing downstream knows it's a mock.
 *
 * It simulates a real verifier by:
 *   - returning a realistic async latency,
 *   - rejecting obviously-bad codes (so the "invalid" UX path is exercised),
 *   - inferring a container type from the code prefix, and
 *   - emitting a stable verificationRef derived from the code, so re-submitting
 *     the same code yields the same ref (mirrors real de-duplication).
 */

import type { ContainerType } from '../../types/models';
import type {
  VerificationAdapter,
  VerifyReturnInput,
  VerifyReturnResult,
} from './types';

const LATENCY_MS = 700;

/** Code prefix -> container type, mimicking encoded RVM receipts. */
const PREFIX_TO_TYPE: Record<string, ContainerType> = {
  PB: 'plastic_bottle',
  MC: 'metal_can',
  GB: 'glass_bottle',
  CT: 'carton',
};

function inferContainerType(code: string): ContainerType {
  const prefix = code.slice(0, 2).toUpperCase();
  return PREFIX_TO_TYPE[prefix] ?? 'plastic_bottle';
}

/** Tiny deterministic hash so the same code -> same ref (de-dupe behaviour). */
function refFromCode(code: string): string {
  let h = 0;
  for (let i = 0; i < code.length; i++) {
    h = (h * 31 + code.charCodeAt(i)) >>> 0;
  }
  return `mock-ret-${h.toString(16)}`;
}

export const mockRvmAdapter: VerificationAdapter = {
  async verifyReturn(input: VerifyReturnInput): Promise<VerifyReturnResult> {
    await new Promise((r) => setTimeout(r, LATENCY_MS));

    const code = input.code.trim();

    // Reject empties and a sentinel "bad" code so the failure path is testable.
    if (!code || code.toUpperCase() === 'INVALID') {
      return {
        valid: false,
        containerType: null,
        timestamp: new Date().toISOString(),
        verificationRef: '',
        reason: "We couldn't confirm that return with BCRS. Please scan the code on the RVM screen again.",
      };
    }

    return {
      valid: true,
      containerType: inferContainerType(code),
      timestamp: new Date().toISOString(),
      verificationRef: refFromCode(code),
    };
  },
};
