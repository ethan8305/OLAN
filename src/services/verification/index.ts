/**
 * Verification entry point. The REST OF THE APP IMPORTS ONLY FROM HERE.
 *
 *   import { verifyReturn } from '../services/verification';
 *
 * To go live, change `activeAdapter` from mockRvmAdapter to returnRightAdapter
 * once the latter is implemented. That single line is the entire cutover.
 */

import { mockRvmAdapter } from './mockRvmAdapter';
// import { returnRightAdapter } from './returnRightAdapter'; // <- swap in for prod
import type {
  VerificationAdapter,
  VerifyReturnInput,
  VerifyReturnResult,
} from './types';

// ----------------------------------------------------------------------------
// THE ONE LINE TO CHANGE WHEN THE REAL BACKEND IS READY:
const activeAdapter: VerificationAdapter = mockRvmAdapter;
// ----------------------------------------------------------------------------

export function verifyReturn(input: VerifyReturnInput): Promise<VerifyReturnResult> {
  return activeAdapter.verifyReturn(input);
}

export type { VerificationAdapter, VerifyReturnInput, VerifyReturnResult };
