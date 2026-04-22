'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type FaqSeed = {
  question_bm: string;
  answer_bm: string;
  question_en: string;
  answer_en: string;
};

type Props = {
  tickerItemsBm: string[];
  tickerItemsEn: string[];
  faqs: FaqSeed[];
  showTicker?: boolean;
  showFaq?: boolean;
  faqAccordion?: boolean;
};

function normalizeFaqs(faqs: FaqSeed[]): FaqSeed[] {
  const firstTen = [...faqs].slice(0, 10);
  while (firstTen.length < 10) {
    firstTen.push({ question_bm: '', answer_bm: '', question_en: '', answer_en: '' });
  }
  return firstTen;
}

export function SettingsDynamicFields({ tickerItemsBm, tickerItemsEn, faqs, showTicker = true, showFaq = true, faqAccordion = false }: Props) {
  const [bmItems, setBmItems] = useState<string[]>(tickerItemsBm.length > 0 ? tickerItemsBm : ['']);
  const [enItems, setEnItems] = useState<string[]>(tickerItemsEn.length > 0 ? tickerItemsEn : ['']);
  const [faqRows, setFaqRows] = useState<FaqSeed[]>(() => normalizeFaqs(faqs));
  const [visibleFaqRows, setVisibleFaqRows] = useState<number>(() => Math.min(Math.max(faqs.length || 3, 1), 10));

  useEffect(() => {
    setBmItems(tickerItemsBm.length > 0 ? tickerItemsBm : ['']);
  }, [tickerItemsBm]);

  useEffect(() => {
    setEnItems(tickerItemsEn.length > 0 ? tickerItemsEn : ['']);
  }, [tickerItemsEn]);

  useEffect(() => {
    setFaqRows(normalizeFaqs(faqs));
    setVisibleFaqRows(Math.min(Math.max(faqs.length || 3, 1), 10));
  }, [faqs]);

  const bmJoined = useMemo(() => bmItems.map((item) => item.trim()).filter(Boolean).join('\n'), [bmItems]);
  const enJoined = useMemo(() => enItems.map((item) => item.trim()).filter(Boolean).join('\n'), [enItems]);

  return (
    <>
      {showTicker ? (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-200">Ticker Items BM (Dynamic List)</label>
          <div className="space-y-2">
            {bmItems.map((item, index) => (
              <div key={`bm-${index}`} className="flex gap-2">
                <input
                  value={item}
                  onChange={(event) => {
                    const next = [...bmItems];
                    next[index] = event.target.value;
                    setBmItems(next);
                  }}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-700 text-slate-300"
                  onClick={() => setBmItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)))}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" className="border-emerald-400/40 text-emerald-200" onClick={() => setBmItems((prev) => [...prev, ''])}>
              + Add BM Item
            </Button>
          </div>
          <textarea name="ticker_items_bm" value={bmJoined} readOnly className="sr-only" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-200">Ticker Items EN (Dynamic List)</label>
          <div className="space-y-2">
            {enItems.map((item, index) => (
              <div key={`en-${index}`} className="flex gap-2">
                <input
                  value={item}
                  onChange={(event) => {
                    const next = [...enItems];
                    next[index] = event.target.value;
                    setEnItems(next);
                  }}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-700 text-slate-300"
                  onClick={() => setEnItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)))}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" className="border-emerald-400/40 text-emerald-200" onClick={() => setEnItems((prev) => [...prev, ''])}>
              + Add EN Item
            </Button>
          </div>
          <textarea name="ticker_items_en" value={enJoined} readOnly className="sr-only" />
        </div>
        </div>
      ) : null}

      {showFaq ? (
        <div className="mt-5 rounded-lg border border-slate-700/80 bg-slate-900/50 p-4">
        <p className="text-sm font-semibold text-slate-100">FAQ Repeater (max 10)</p>
        <div className="mt-3 space-y-4">
          {faqAccordion ? (
            <Accordion type="single" collapsible defaultValue="faq-1" className="rounded-md border border-slate-700/70 bg-slate-950/60 px-3">
              {faqRows.slice(0, visibleFaqRows).map((row, index) => (
                <AccordionItem key={`faq-${index}`} value={`faq-${index + 1}`} className="border-slate-800">
                  <AccordionTrigger className="py-3 text-left text-xs uppercase tracking-[0.14em] text-emerald-200 hover:no-underline">
                    FAQ #{index + 1} {row.question_bm ? `· ${row.question_bm}` : ''}
                  </AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        value={row.question_bm}
                        onChange={(event) => {
                          const next = [...faqRows];
                          next[index] = { ...next[index], question_bm: event.target.value };
                          setFaqRows(next);
                        }}
                        placeholder="Question BM"
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                      />
                      <input
                        value={row.question_en}
                        onChange={(event) => {
                          const next = [...faqRows];
                          next[index] = { ...next[index], question_en: event.target.value };
                          setFaqRows(next);
                        }}
                        placeholder="Question EN"
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                      />
                      <textarea
                        value={row.answer_bm}
                        onChange={(event) => {
                          const next = [...faqRows];
                          next[index] = { ...next[index], answer_bm: event.target.value };
                          setFaqRows(next);
                        }}
                        placeholder="Answer BM"
                        rows={3}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                      />
                      <textarea
                        value={row.answer_en}
                        onChange={(event) => {
                          const next = [...faqRows];
                          next[index] = { ...next[index], answer_en: event.target.value };
                          setFaqRows(next);
                        }}
                        placeholder="Answer EN"
                        rows={3}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            faqRows.slice(0, visibleFaqRows).map((row, index) => (
              <div key={`faq-${index}`} className="rounded-md border border-slate-700/70 bg-slate-950/70 p-3">
                <p className="mb-2 text-xs uppercase tracking-[0.14em] text-emerald-200">FAQ #{index + 1}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    value={row.question_bm}
                    onChange={(event) => {
                      const next = [...faqRows];
                      next[index] = { ...next[index], question_bm: event.target.value };
                      setFaqRows(next);
                    }}
                    placeholder="Question BM"
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                  <input
                    value={row.question_en}
                    onChange={(event) => {
                      const next = [...faqRows];
                      next[index] = { ...next[index], question_en: event.target.value };
                      setFaqRows(next);
                    }}
                    placeholder="Question EN"
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                  <textarea
                    value={row.answer_bm}
                    onChange={(event) => {
                      const next = [...faqRows];
                      next[index] = { ...next[index], answer_bm: event.target.value };
                      setFaqRows(next);
                    }}
                    placeholder="Answer BM"
                    rows={3}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                  <textarea
                    value={row.answer_en}
                    onChange={(event) => {
                      const next = [...faqRows];
                      next[index] = { ...next[index], answer_en: event.target.value };
                      setFaqRows(next);
                    }}
                    placeholder="Answer EN"
                    rows={3}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="border-emerald-400/40 text-emerald-200"
            onClick={() => setVisibleFaqRows((prev) => Math.min(prev + 1, 10))}
            disabled={visibleFaqRows >= 10}
          >
            + Add FAQ Row
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-slate-700 text-slate-300"
            onClick={() => setVisibleFaqRows((prev) => Math.max(prev - 1, 1))}
            disabled={visibleFaqRows <= 1}
          >
            - Remove Last Row
          </Button>
        </div>

        {faqRows.map((row, index) => (
          <div key={`faq-hidden-${index}`} className="sr-only">
            <input name={`faq_question_bm_${index + 1}`} value={row.question_bm} readOnly />
            <input name={`faq_answer_bm_${index + 1}`} value={row.answer_bm} readOnly />
            <input name={`faq_question_en_${index + 1}`} value={row.question_en} readOnly />
            <input name={`faq_answer_en_${index + 1}`} value={row.answer_en} readOnly />
          </div>
        ))}
        </div>
      ) : null}
    </>
  );
}

