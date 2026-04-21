'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function SaveStatusToast() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  const status = searchParams.get('status');

  const config = useMemo(() => {
    if (status === 'saved') {
      return {
        title: 'Saved',
        message: 'Site settings updated successfully.',
        className: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100',
      };
    }

    if (status === 'error') {
      return {
        title: 'Save Failed',
        message: 'Unable to save updates. Check connection and try again.',
        className: 'border-red-500/50 bg-red-500/10 text-red-100',
      };
    }

    return null;
  }, [status]);

  if (!config || dismissed) return null;

  return (
    <div className={`fixed right-4 top-4 z-50 w-[340px] rounded-lg border p-4 shadow-xl backdrop-blur ${config.className}`}>
      <div className="mb-1 text-sm font-semibold">{config.title}</div>
      <div className="text-xs opacity-90">{config.message}</div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="mt-3 rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
      >
        Dismiss
      </button>
    </div>
  );
}

