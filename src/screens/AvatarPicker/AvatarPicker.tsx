import { useState } from 'react';
import { Button } from '../../components/Button';
import { AVATARS } from '../../data/avatars';
import { useStore } from '../../store/useStore';

/** Pick one of the 5 standard starter avatars. */
export function AvatarPicker() {
  const setAvatar = useStore((s) => s.setAvatar);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-slate-50 px-7 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-extrabold text-slate-800">Pick your buddy</h1>
        <p className="mt-1 text-sm text-slate-500">
          You’ll dress them up with points you earn from real returns.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {AVATARS.map((a) => {
          const active = selected === a.id;
          return (
            <button
              key={a.id}
              onClick={() => setSelected(a.id)}
              className={`flex flex-col items-center gap-2 rounded-3xl border-2 bg-white p-5 transition ${
                active ? 'border-brand-500 ring-4 ring-brand-100' : 'border-transparent'
              }`}
            >
              <div
                className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${a.bg} text-4xl shadow-inner`}
              >
                {a.emoji}
              </div>
              <span className="text-sm font-semibold text-slate-700">{a.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        <Button disabled={!selected} onClick={() => selected && setAvatar(selected)}>
          That’s the one
        </Button>
      </div>
    </div>
  );
}
