import { getAvatar } from '../data/avatars';
import { getCosmetic } from '../data/cosmetics';

interface Props {
  avatarId: string;
  equippedItemIds?: string[];
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: { box: 'h-12 w-12', emoji: 'text-2xl', badge: 'text-xs' },
  md: { box: 'h-24 w-24', emoji: 'text-5xl', badge: 'text-base' },
  lg: { box: 'h-36 w-36', emoji: 'text-7xl', badge: 'text-2xl' },
};

/** Renders an avatar with any equipped cosmetics layered around it. */
export function AvatarDisplay({ avatarId, equippedItemIds = [], size = 'md' }: Props) {
  const avatar = getAvatar(avatarId);
  const s = SIZES[size];
  const equipped = equippedItemIds.map(getCosmetic).filter(Boolean);
  const hat = equipped.find((c) => c!.slot === 'hat');
  const top = equipped.find((c) => c!.slot === 'top');
  const accessory = equipped.find((c) => c!.slot === 'accessory');
  const background = equipped.find((c) => c!.slot === 'background');

  return (
    <div
      className={`relative flex ${s.box} items-center justify-center rounded-full bg-gradient-to-br ${avatar.bg} shadow-inner`}
    >
      {background && (
        <span className={`absolute inset-0 flex items-center justify-center opacity-30 ${s.emoji}`}>
          {background.emoji}
        </span>
      )}
      <span className={s.emoji}>{avatar.emoji}</span>
      {hat && (
        <span className={`absolute -top-2 ${s.badge}`} aria-label={hat.name}>
          {hat.emoji}
        </span>
      )}
      {accessory && (
        <span className={`absolute -right-1 bottom-1 ${s.badge}`} aria-label={accessory.name}>
          {accessory.emoji}
        </span>
      )}
      {top && (
        <span className={`absolute -bottom-2 ${s.badge}`} aria-label={top.name}>
          {top.emoji}
        </span>
      )}
    </div>
  );
}
