/** Backend entry point. Swap `repository` for a real API client in production. */
import { localRepository } from './localRepository';
import type { Repository } from './types';

export const repository: Repository = localRepository;
export { freshAppData } from './localRepository';
export type { Repository } from './types';
