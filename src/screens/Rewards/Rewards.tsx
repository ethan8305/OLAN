import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { COSMETICS } from '../../data/cosmetics';
import { FURNITURE } from '../../data/furniture';
import { AvatarDisplay } from '../../components/AvatarDisplay';

/**
 * Rewards — COSMETIC-ONLY for v1. Points buy avatar clothing/items and room
 * furniture, nothing else: no real-goods marketplace, no money, no blind boxes,
 * no donations. Keeping the economy closed removes any cash incentive to game
 * points. The real-goods "Marketplace" is explicitly OUT OF SCOPE and appears
 * only as a clearly-labelled, disabled "coming soon" stub.
 */
export function Rewards() {
  const { t } = useTranslation();
  const { user, points } = useStore();
  const [tab, setTab] = useState<'avatar' | 'room'>('avatar');
  if (!user) return null;

  return (
    <div className="space-y-5 px-5 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{t('rewards.title')}</h1>
          <p className="text-sm text-slate-400">{t('rewards.subtitle')}</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-700">
          ⭐ {points.toLocaleString()}
        </span>
      </header>

      {/* Tabs: dress up the avatar, or decorate the room. */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-200/60 p-1">
        <TabButton active={tab === 'avatar'} onClick={() => setTab('avatar')}>
          🧑 {t('rewards.cosmeticShop')}
        </TabButton>
        <TabButton active={tab === 'room'} onClick={() => setTab('room')}>
          🛋️ {t('rewards.room')}
        </TabButton>
      </div>

      {tab === 'avatar' ? <AvatarTab /> : <RoomTab />}

      {/* OUT OF SCOPE v1: real-goods marketplace. Disabled stub only. */}
      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          {t('rewards.marketplace')}
        </h2>
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-100 p-5 text-center opacity-70">
          <div className="text-3xl">🛒</div>
          <p className="mt-1 font-semibold text-slate-500">
            {t('rewards.marketplace')} ({t('common.comingSoon')})
          </p>
          <p className="mt-1 text-xs text-slate-400">{t('rewards.marketplaceStub')}</p>
          <button
            disabled
            className="mt-3 cursor-not-allowed rounded-full bg-slate-300 px-4 py-1.5 text-sm font-semibold text-white"
          >
            {t('common.locked')}
          </button>
        </div>
      </section>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl py-2 text-sm font-semibold transition ${
        active ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
      }`}
    >
      {children}
    </button>
  );
}

function AvatarTab() {
  const { t } = useTranslation();
  const { user, points, buyCosmetic, toggleEquip } = useStore();
  if (!user) return null;

  return (
    <>
      <div className="flex flex-col items-center gap-2 rounded-3xl bg-white p-5 shadow-sm">
        <AvatarDisplay avatarId={user.avatarId} equippedItemIds={user.equippedItemIds} size="lg" />
        <p className="text-xs text-slate-400">{t('rewards.equipHint')}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {COSMETICS.map((item) => (
          <ShopCard
            key={item.id}
            name={item.name}
            emoji={item.emoji}
            sub={item.slot}
            price={item.pricePoints}
            owned={user.ownedItemIds.includes(item.id)}
            active={user.equippedItemIds.includes(item.id)}
            canAfford={points >= item.pricePoints}
            onBuy={() => {
              const res = buyCosmetic(item.id);
              if (!res.ok && res.reason) alert(res.reason);
            }}
            onToggle={() => toggleEquip(item.id)}
          />
        ))}
      </div>
    </>
  );
}

function RoomTab() {
  const { t } = useTranslation();
  const { user, points, buyFurniture, toggleRoomItem } = useStore();
  if (!user) return null;

  const placed = FURNITURE.filter((f) => user.roomItemIds.includes(f.id));

  return (
    <>
      {/* The customisable room: placeholder recycled-themed furniture. */}
      <div className="rounded-3xl bg-gradient-to-b from-amber-50 to-emerald-50 p-5 shadow-inner">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {t('rewards.roomSub')}
        </p>
        <div className="flex min-h-[96px] flex-wrap items-end gap-3 rounded-2xl bg-white/60 p-4">
          {placed.length === 0 ? (
            <span className="text-sm text-slate-400">🪟 …</span>
          ) : (
            placed.map((f) => (
              <span key={f.id} className="animate-pop-in text-4xl" title={f.name}>
                {f.emoji}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FURNITURE.map((item) => (
          <ShopCard
            key={item.id}
            name={item.name}
            emoji={item.emoji}
            price={item.pricePoints}
            owned={user.ownedItemIds.includes(item.id)}
            active={user.roomItemIds.includes(item.id)}
            canAfford={points >= item.pricePoints}
            onBuy={() => {
              const res = buyFurniture(item.id);
              if (!res.ok && res.reason) alert(res.reason);
            }}
            onToggle={() => toggleRoomItem(item.id)}
          />
        ))}
      </div>
    </>
  );
}

function ShopCard({
  name,
  emoji,
  sub,
  price,
  owned,
  active,
  canAfford,
  onBuy,
  onToggle,
}: {
  name: string;
  emoji: string;
  sub?: string;
  price: number;
  owned: boolean;
  active: boolean;
  canAfford: boolean;
  onBuy: () => void;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-4xl">{emoji}</div>
      <p className="text-sm font-semibold text-slate-700">{name}</p>
      {sub && <p className="text-[11px] uppercase tracking-wide text-slate-400">{sub}</p>}

      {owned ? (
        <button
          onClick={onToggle}
          className={`w-full rounded-full px-3 py-1.5 text-sm font-semibold transition ${
            active ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-700'
          }`}
        >
          {active ? t('rewards.equipped') : t('rewards.equip')}
        </button>
      ) : (
        <button
          onClick={onBuy}
          disabled={!canAfford}
          className="w-full rounded-full bg-amber-400 px-3 py-1.5 text-sm font-bold text-amber-900 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          ⭐ {price}
        </button>
      )}
    </div>
  );
}
