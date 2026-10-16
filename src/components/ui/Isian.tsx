import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

/** Input Figma (`81:66`): label Body/S Strong ink-2, field 48 px border 2, placeholder muted. */
const FIELD =
  'h-12 w-full border-2 border-ink bg-paper px-3 t-body-m text-ink placeholder:text-muted outline-none focus-visible:shadow-pixel-sm disabled:bg-canvas';

export function Isian({ label, catatan, ...props }: { label: string; catatan?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="t-body-s font-bold text-ink-2">{label}</span>
      <input {...props} className={FIELD} />
      {catatan}
    </label>
  );
}

export function Pilihan({ label, children, ...props }: { label: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="flex w-full flex-col gap-2">
      <span className="t-body-s font-bold text-ink-2">{label}</span>
      <select {...props} className={`${FIELD} cursor-pointer`}>
        {children}
      </select>
    </label>
  );
}
