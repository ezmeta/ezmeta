'use client';

import { useMemo, useState } from 'react';

type DateTimePickerProps = {
  name: string;
  id: string;
  defaultIsoValue?: string;
  placeholder?: string;
  className?: string;
};

function toLocalDateTimeValue(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export function DateTimePicker({ name, id, defaultIsoValue = '', placeholder, className }: DateTimePickerProps) {
  const [localValue, setLocalValue] = useState<string>(toLocalDateTimeValue(defaultIsoValue));

  const isoValue = useMemo(() => {
    if (!localValue) return '';
    const date = new Date(localValue);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString();
  }, [localValue]);

  return (
    <div>
      <input
        id={id}
        type="datetime-local"
        value={localValue}
        placeholder={placeholder}
        onChange={(event) => setLocalValue(event.target.value)}
        className={
          className ??
          'w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500'
        }
      />
      <input type="hidden" name={name} value={isoValue} readOnly />
    </div>
  );
}

