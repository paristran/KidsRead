"use client";

import type { PlaybackState } from "@/lib/speech";
import type { AppSpeed } from "@/hooks/useSpeech";

interface PlaybackControlsProps {
  playbackState: PlaybackState;
  speed: AppSpeed;
  playAll: boolean;
  onPause: () => void;
  onStop: () => void;
  onPlayAll: () => void;
  onSetSpeedNormal: () => void;
  onSetSpeedSlow: () => void;
}

export function PlaybackControls({
  playbackState,
  speed,
  playAll,
  onPause,
  onStop,
  onPlayAll,
  onSetSpeedNormal,
  onSetSpeedSlow,
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

      {/* Speed: Normal / Slow */}
      <div className="flex rounded-full bg-neutral-100 overflow-hidden">
        <button
          onClick={onSetSpeedNormal}
          className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
            speed === 1
              ? "bg-neutral-900 text-white shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          🙂 Normal
        </button>
        <button
          onClick={onSetSpeedSlow}
          className={`px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
            speed === 0.7
              ? "bg-amber-500 text-white shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          🐢 Slow
        </button>
      </div>

      {isPlaying && playAll && (
        <span className="text-sm text-neutral-400 animate-pulse">Reading aloud...</span>
      )}
    </div>
  );
}
