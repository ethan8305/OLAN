import { useStore } from '../../store/useStore';
import { COSMETICS } from '../../data/cosmetics';
import { AvatarDisplay } from '../../components/AvatarDisplay';
import type { CosmeticItem } from '../../types/models';

/**
 * Rewards — COSMETIC-ONLY for v1. Points buy avatar clothing/items and nothing
 * else: no real-goods marketplace, no money, no blind boxes, no donations.
 * Keeping the economy closed removes any cash incentive to game points. The
 * real-goods "Marketplace" is explicitly OUT OF SCOPE for v1 and appears only as
 * a clearly-labelled, disabled "coming soon" stub at the bottom.
 */
export function Rewards() {
  const { user, points, buyCosmetic, toggleEquip } = useStore();
  if (!user) return null;

  return (
    <div className="space-y-6 px-5 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Rewards</h1>
          <p className="text-sm text-slate-400">Spend points on looks for your buddy.</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-700">
          ⭐ {points.toLocaleString()}
        </span>
      </header>

      <div className="flex flex-col items-center gap-2 rounded-3xl bg-white p-5 shadow-sm">
        <AvatarDisplay avatarId={user.avatarId} equippedItemIds={user.equippedItemIds} size="lg" />
        <p className="text-xs text-slate-400">Tap an owned item to equip / unequip it.</p>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          Cosmetic shop
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {COSMETICS.map((item) => (
            <ShopCard
              key={item.id}
              item={item}
              owned={user.ownedItemIds.includes(item.id)}
              equipped={user.equippedItemIds.includes(item.id)}
              canAfford={points >= item.pricePoints}
              onBuy={() => {
                const res = buyCosmetic(item.id);
                if (!res.ok && res.reason) alert(res.reason);
              }}
              onEquip={() => toggleEquip(item.id)}
            />
          ))}
        </div>
      </section>

      {/* OUT OF SCOPE v1: real-goods marketplace. Disabled stub only. */}
      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          Marketplace
        </h2>
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-100 p-5 text-center opacity-70">
          <div className="text-3xl">🛒</div>
          <p className="mt-1 font-semibold text-slate-500">Marketplace (coming soon)</p>
          <p className="mt-1 text-xs text-slate-400">
            Real-world rewards aren’t part of v1. Points stay cosmetic for now — no money, no
            real goods. This keeps the game honest.
          </p>
          <button
            disabled
            className="mt-3 cursor-not-allowed rounded-full bg-slate-300 px-4 py-1.5 text-sm font-semibold text-white"
          >
            Locked
          </button>
        </div>
      </section>
    </div>
  );
}

function ShopCard({
  item,
  owned,
  equipped,
  canAfford,
  onBuy,
  onEquip,
}: {
  item: CosmeticItem;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  onBuy: () => void;
  onEquip: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm">
      <div className="text-4xl">{item.emoji}</div>
      <p className="text-sm font-semibold text-slate-700">{item.name}</p>
      <p className="text-[11px] uppercase tracking-wide text-slate-400">{item.slot}</p>

      {owned ? (
        <button
          onClick={onEquip}
          className={`w-full rounded-full px-3 py-1.5 text-sm font-semibold transition ${
            equipped ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-700'
          }`}
        >
          {equipped ? 'Equipped' : 'Equip'}
        </button>
      ) : (
        <button
          onClick={onBuy}
          disabled={!canAfford}
          className="w-full rounded-full bg-amber-400 px-3 py-1.5 text-sm font-bold text-amber-900 transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          ⭐ {item.pricePoints}
        </button>
      )}
    </div>
  );
}
