"use client";

interface VoiceSelectorProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onSelect: (voice: SpeechSynthesisVoice) => void;
}

export function VoiceSelector({ voices, selectedVoice, onSelect }: VoiceSelectorProps) {
  if (voices.length === 0) return null;

  return (
    <div className="mt-4 flex justify-center">
      <select
        value={selectedVoice?.name || ""}
        onChange={(e) => {
          const voice = voices.find((v) => v.name === e.target.value);
          if (voice) onSelect(voice);
        }}
        className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-600 text-sm border-none outline-none cursor-pointer hover:bg-neutral-200 transition-colors appearance-none text-center pr-8"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='%23737373'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
        }}
      >
        <option value="">Default Voice</option>
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </select>
    </div>
  );
}
