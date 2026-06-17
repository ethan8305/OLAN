/**
 * Data-persistence boundary (the "backend" seam, separate from the verification
 * seam). Today this is a localStorage-backed mock. Later, a real REST/GraphQL
 * client implements the same Repository interface and the rest of the app is
 * unaffected — same idea as the verification adapter.
 */

import type { AppData } from '../../types/models';

export interface Repository {
  load(): Promise<AppData>;
  save(data: AppData): Promise<void>;
  clear(): Promise<void>;
}
