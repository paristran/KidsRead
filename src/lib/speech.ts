export type PlaybackSpeed = 0.7 | 1 | 1.3;

export type PlaybackState = "idle" | "playing" | "paused";

export interface SpeechOptions {
  rate: PlaybackSpeed;
  voice?: SpeechSynthesisVoice | null;
  pitch: number;
  onEnd?: () => void;
  onBoundary?: (event: SpeechSynthesisEvent) => void;
}

function getKidFriendlyVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();

  const preferred = ["Samantha", "Karen", "Victoria", "Zuzana", "Fiona"];
  for (const name of preferred) {
    const found = voices.find(
      (v) => v.name.includes(name) && v.lang.startsWith("en")
    );
    if (found) return found;
  }

  const englishFemale = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("woman"))
  );
  if (englishFemale) return englishFemale;

  const english = voices.find((v) => v.lang.startsWith("en"));
  return english || null;
}

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve([]);
      return;
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
  });
}

export function speak(
  text: string,
  options: SpeechOptions
): SpeechSynthesisUtterance {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    throw new Error("Speech synthesis not supported");
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate;
  utterance.pitch = options.pitch;
  utterance.volume = 1;

  const voice = options.voice || getKidFriendlyVoice();
  if (voice) {
    utterance.voice = voice;
  }

  if (options.onEnd) {
    utterance.onend = options.onEnd;
  }
  if (options.onBoundary) {
    utterance.onboundary = options.onBoundary;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function pause(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.pause();
  }
}

export function resume(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.resume();
  }
}

export function cancel(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith("en"));
}
