const SENTENCE_REGEX = /[^.!?]*[.!?]+/g;

export function splitSentences(text: string): string[] {
  if (!text.trim()) return [];

  const matches = text.match(SENTENCE_REGEX);
  if (!matches) return [text.trim()];

  return matches.map((s) => s.trim()).filter((s) => s.length > 0);
}

export function getSentencePositions(text: string): { start: number; end: number; text: string }[] {
  const sentences = splitSentences(text);
  const positions: { start: number; end: number; text: string }[] = [];
  let searchOffset = 0;

  for (const sentence of sentences) {
    const start = text.indexOf(sentence, searchOffset);
    if (start !== -1) {
      positions.push({ start, end: start + sentence.length, text: sentence });
      searchOffset = start + sentence.length;
    }
  }

  return positions;
}
