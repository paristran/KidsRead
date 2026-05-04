"use client";

import { useEffect, useState } from "react";
import { fetchPronunciation } from "@/lib/pronunciation";

interface SelectionPronunciationProps {
  selectedText: string;
  rect: DOMRect | null;
}

export function SelectionPronunciation({ selectedText, rect }: SelectionPronunciationProps) {
  const [pronunciations, setPronunciations] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedText) {
      setPronunciations(new Map());
      return;
    }

    const words = selectedText
      .split(/\s+/)
      .map((w) => w.toLowerCase().replace(/[^a-z'-]/g, ""))
      .filter(Boolean);
    const unique = [...new Set(words)];

    if (unique.length === 0) {
      setPronunciations(new Map());
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all(unique.map((w) => fetchPronunciation(w))).then((results) => {
      if (cancelled) return;
      const map = new Map<string, string>();
      results.forEach((pron, i) => {
        if (pron) map.set(unique[i], pron);
      });
      setPronunciations(map);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [selectedText]);

  if (!selectedText || !rect) return null;

  const words = selectedText.split(/\s+/).filter(Boolean);

  // Position above the selection
  const top = rect.top - 8 + window.scrollY;
  const left = rect.left + rect.width / 2;

  const hasAnyPronunciation = words.some(
    (w) => pronunciations.has(w.toLowerCase().replace(/[^a-z'-]/g, ""))
  );

  return (
    <div
      className="fixed z-40 pointer-events-none"
      style={{
        top,
        left,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg animate-fade-in-up">
        <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center">
          {words.map((word, i) => {
            const clean = word.toLowerCase().replace(/[^a-z'-]/g, "");
            const pron = pronunciations.get(clean);
            return (
              <span key={i} className="flex flex-col items-center leading-tight">
                <span className="text-[11px] text-amber-300 font-mono">
                  {loading ? (
                    <span className="inline-block w-6 h-2.5 bg-neutral-700 rounded animate-pulse" />
                  ) : pron ? (
                    pron
                  ) : (
                    ""
                  )}
                </span>
              </span>
            );
          })}
        </div>
      </div>
      {/* Arrow */}
      <div className="flex justify-center -mt-px">
        <div className="w-2.5 h-2.5 bg-neutral-900 rotate-45 -translate-y-1.5" />
      </div>
    </div>
  );
}
