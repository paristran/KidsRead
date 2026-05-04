const cache = new Map<string, string>();

interface DictEntry {
  phonetic?: string;
  phonetics?: { text?: string }[];
}

export async function fetchPronunciation(word: string): Promise<string> {
  const cleaned = word.toLowerCase().replace(/[^a-z'-]/g, "");
  if (!cleaned) return "";

  if (cache.has(cleaned)) return cache.get(cleaned)!;

  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleaned)}`
    );
    if (!res.ok) {
      cache.set(cleaned, "");
      return "";
    }
    const data: DictEntry[] = await res.json();
    const entry = data[0];
    const phonetic =
      entry?.phonetic ||
      entry?.phonetics?.find((p) => p.text)?.text ||
      "";
    cache.set(cleaned, phonetic);
    return phonetic;
  } catch {
    cache.set(cleaned, "");
    return "";
  }
}

export async function fetchPronunciations(
  words: string[]
): Promise<Map<string, string>> {
  const unique = [...new Set(words.map((w) => w.toLowerCase().replace(/[^a-z'-]/g, "")).filter(Boolean))];
  const results = new Map<string, string>();

  // Fetch in parallel batches of 8 to avoid overwhelming the API
  const batchSize = 8;
  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize);
    const settled = await Promise.allSettled(
      batch.map((w) => fetchPronunciation(w))
    );
    settled.forEach((r, idx) => {
      if (r.status === "fulfilled" && r.value) {
        results.set(batch[idx], r.value);
      }
    });
  }

  return results;
}
