import type { Avatar } from '../types/models';

/** 5 standard starter avatars shown in the avatar picker. */
export const AVATARS: Avatar[] = [
  { id: 'sprout', name: 'Sprout', emoji: '🌱', bg: 'from-emerald-300 to-green-500' },
  { id: 'otter', name: 'Otter', emoji: '🦦', bg: 'from-amber-300 to-orange-500' },
  { id: 'turtle', name: 'Shelly', emoji: '🐢', bg: 'from-teal-300 to-cyan-500' },
  { id: 'bee', name: 'Buzz', emoji: '🐝', bg: 'from-yellow-300 to-amber-500' },
  { id: 'panda', name: 'Bao', emoji: '🐼', bg: 'from-slate-300 to-slate-500' },
];

export function getAvatar(id: string): Avatar {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
