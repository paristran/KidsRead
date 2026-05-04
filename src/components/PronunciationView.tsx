"use client";

import { useEffect, useState, useMemo } from "react";
import { fetchPronunciations } from "@/lib/pronunciation";

interface PronunciationViewProps {
  text: string;
  currentSentenceIndex: number;
  playing: boolean;
}

interface Word {
  text: string;
  clean: string;
}

function splitIntoWords(sentence: string): Word[] {
  const parts = sentence.match(/\S+/g) || [];
  return parts.map((p) => ({
    text: p,
    clean: p.toLowerCase().replace(/[^a-z'-]/g, ""),
  }));
}

export function PronunciationView({
  text,
  currentSentenceIndex,
  playing,
}: PronunciationViewProps) {
  const [pronunciations, setPronunciations] = useState<Map<string, string>>(
    new Map()
  );
  const [loading, setLoading] = useState(false);

  const sentences = useMemo(() => {
    const raw = text.match(/[^.!?]*[.!?]+/g) || [text];
    return raw.map((s) => s.trim()).filter((s) => s.length > 0);
  }, [text]);

  const allWords = useMemo(() => {
    const words: Word[] = [];
    for (const s of sentences) {
      words.push(...splitIntoWords(s));
    }
    return words;
  }, [sentences]);

  useEffect(() => {
    let cancelled = false;
    const uniqueWords = [
      ...new Set(allWords.map((w) => w.clean).filter(Boolean)),
    ];
    if (uniqueWords.length === 0) return;

    // Check cache first
    const cached = new Map<string, string>();
    const uncached: string[] = [];
    for (const w of uniqueWords) {
      const existing = pronunciations.get(w);
      if (existing !== undefined) {
        if (existing) cached.set(w, existing);
      } else {
        uncached.push(w);
      }
    }

    if (uncached.length === 0) return;

    setLoading(true);
    fetchPronunciations(uncached).then((results) => {
      if (cancelled) return;
      setPronunciations((prev) => {
        const next = new Map(prev);
        results.forEach((v, k) => next.set(k, v));
        // Mark words with no pronunciation so we don't re-fetch
        for (const w of uncached) {
          if (!next.has(w)) next.set(w, "");
        }
        return next;
      });
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allWords]);

  return (
    <div className="space-y-6">
      {sentences.map((sentence, si) => {
        const words = splitIntoWords(sentence);
        const isCurrent = playing && currentSentenceIndex === si;
        const isPast = playing && currentSentenceIndex > si;

        return (
          <div
            key={si}
            className={`transition-all duration-500 ${
              isCurrent ? "opacity-100" : isPast ? "opacity-40" : "opacity-90"
            }`}
          >
            {/* Sentence number */}
            <div className="text-xs text-neutral-300 mb-1.5 font-medium tracking-wide">
              {si + 1}
            </div>
            <div className="rounded-xl overflow-hidden border border-neutral-100">
              <table className="w-full">
                <tbody>
                  {words.map((word, wi) => {
                    const pron = word.clean
                      ? pronunciations.get(word.clean) || ""
                      : "";
                    return (
                      <tr
                        key={wi}
                        className={`border-b border-neutral-50 last:border-0 ${
                          isCurrent
                            ? "bg-amber-50/50"
                            : "bg-white hover:bg-neutral-50/50"
                        } transition-colors duration-300`}
                      >
                        <td className="py-1.5 px-4 text-base sm:text-lg text-neutral-800 font-medium w-1/3 align-middle">
                          {word.text}
                        </td>
                        <td className="py-1.5 px-4 text-sm sm:text-base text-neutral-400 align-middle font-mono">
                          {loading && !pron ? (
                            <span className="inline-block w-16 h-4 bg-neutral-100 rounded animate-pulse" />
                          ) : pron ? (
                            pron
                          ) : (
                            <span className="text-neutral-200">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
