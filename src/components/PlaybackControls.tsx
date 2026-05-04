"use client";

import type { PlaybackSpeed, PlaybackState } from "@/lib/speech";

interface PlaybackControlsProps {
  playbackState: PlaybackState;
  speed: PlaybackSpeed;
  playAll: boolean;
  showPronunciation: boolean;
  onPause: () => void;
  onStop: () => void;
  onPlayAll: () => void;
  onCycleSpeed: () => void;
  onTogglePronunciation: () => void;
}

const speedLabel: Record<PlaybackSpeed, { emoji: string; text: string }> = {
  0.7: { emoji: "🐢", text: "Slow" },
  1: { emoji: "🙂", text: "Normal" },
  1.3: { emoji: "⚡", text: "Fast" },
};

export function PlaybackControls({
  playbackState,
  speed,
  playAll,
  showPronunciation,
  onPause,
  onStop,
  onPlayAll,
  onCycleSpeed,
  onTogglePronunciation,
}: PlaybackControlsProps) {
  const isPlaying = playbackState === "playing" || playbackState === "paused";

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      {!isPlaying && (
        <button
          onClick={onPlayAll}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-sm font-medium shadow-md hover:bg-neutral-700 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          Play All
        </button>
      )}

      {isPlaying && (
        <>
          <button
            onClick={onPause}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-900 text-white shadow-md hover:bg-neutral-700 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label={playbackState === "playing" ? "Pause" : "Resume"}
          >
            {playbackState === "playing" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={onStop}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-200 text-neutral-700 shadow-sm hover:bg-neutral-300 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Stop"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>
        </>
      )}

      <button
        onClick={onCycleSpeed}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
          isPlaying
            ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        } active:scale-95`}
        aria-label="Change speed"
      >
        <span>{speedLabel[speed].emoji}</span>
        <span>{speedLabel[speed].text}</span>
      </button>

      <button
        onClick={onTogglePronunciation}
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer active:scale-95 ${
          showPronunciation
            ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        }`}
        aria-label="Toggle pronunciation guide"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        <span>Pronunciation</span>
      </button>

      {isPlaying && playAll && (
        <span className="text-sm text-neutral-400 animate-pulse">Reading aloud...</span>
      )}
    </div>
  );
}
