'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

type ModuleSaveButtonProps = {
  label: string;
  className?: string;
  requireDirty?: boolean;
};

function serializeForm(form: HTMLFormElement): string {
  const entries: string[] = [];
  const fields = Array.from(form.elements);
  for (const field of fields) {
    if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement)) {
      continue;
    }
    if (!field.name) continue;

    if (field instanceof HTMLInputElement && field.type === 'checkbox') {
      entries.push(`${field.name}=${field.checked ? '1' : '0'}`);
      continue;
    }

    if (field instanceof HTMLInputElement && field.type === 'radio') {
      if (field.checked) entries.push(`${field.name}=${field.value}`);
      continue;
    }

    entries.push(`${field.name}=${field.value}`);
  }
  return entries.sort().join('&');
}

export function ModuleSaveButton({ label, className, requireDirty = true }: ModuleSaveButtonProps) {
  const { pending } = useFormStatus();
  const markerRef = useRef<HTMLDivElement | null>(null);
  const [dirty, setDirty] = useState<boolean>(!requireDirty);
  const [initialSnapshot, setInitialSnapshot] = useState<string>('');

  useEffect(() => {
    if (!requireDirty) return;
    const form = markerRef.current?.closest('form');
    if (!(form instanceof HTMLFormElement)) return;

    const baseline = serializeForm(form);
    setInitialSnapshot(baseline);
    setDirty(false);

    const recalc = () => setDirty(serializeForm(form) !== baseline);
    form.addEventListener('input', recalc);
    form.addEventListener('change', recalc);
    return () => {
      form.removeEventListener('input', recalc);
      form.removeEventListener('change', recalc);
    };
  }, [requireDirty]);

  useEffect(() => {
    if (!requireDirty || pending) return;
    const form = markerRef.current?.closest('form');
    if (!(form instanceof HTMLFormElement)) return;
    const next = serializeForm(form);
    if (initialSnapshot && next === initialSnapshot) {
      setDirty(false);
    }
  }, [pending, requireDirty, initialSnapshot]);

  const toneClass = useMemo(() => {
    if (!requireDirty) return 'bg-emerald-500 text-slate-950 hover:bg-emerald-400';
    return dirty
      ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300/40 hover:bg-emerald-400'
      : 'bg-slate-800 text-slate-300 hover:bg-slate-700';
  }, [dirty, requireDirty]);

  const disabled = pending || (requireDirty && !dirty);

  return (
    <div ref={markerRef}>
      <button
        type="submit"
        disabled={disabled}
        className={
          className ??
          `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${toneClass}`
        }
      >
        {pending ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
        {pending ? 'Saving...' : label}
      </button>
    </div>
  );
}

