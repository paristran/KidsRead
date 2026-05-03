"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { splitSentences } from "@/lib/sentences";
import { useSpeech } from "@/hooks/useSpeech";
import { PlayButton } from "./PlayButton";
import { PlaybackControls } from "./PlaybackControls";
import { VoiceSelector } from "./VoiceSelector";

export function TextEditor() {
  const [text, setText] = useState(
    `The quick brown fox jumps over the lazy dog. She smiled and said, "Today is a beautiful day!" The children ran through the meadow, laughing and playing tag.\n\nOnce upon a time, there was a little star who lived in the sky. Every night, it would twinkle and shine, watching over the world below. "I want to make everyone happy," whispered the little star.\n\nThe old owl sat on the branch and hooted softly. "Who goes there?" he asked. The little rabbit hopped by and replied, "It's just me, Mr. Owl! I'm looking for carrots."`
  );
  const [selection, setSelection] = useState({ text: "", rect: null as DOMRect | null });
  const [playAll, setPlayAll] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    playbackState,
    speed,
    currentSentenceIndex,
    voices,
    selectedVoice,
    setSelectedVoice,
    speakText,
    speakSentence,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    cycleSpeed,
  } = useSpeech();

  const sentences = splitSentences(text);

  const handleSelectionChange = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      if (playbackState === "idle") {
        setSelection({ text: "", rect: null });
      }
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setSelection({ text: sel.toString().trim(), rect });
  }, [playbackState]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  const handlePlaySelection = useCallback(() => {
    if (!selection.text) return;
    stopSpeech();
    setPlayAll(false);
    speakText(selection.text);
  }, [selection.text, speakText, stopSpeech]);

  const handlePlayAll = useCallback(() => {
    if (sentences.length === 0) return;
    stopSpeech();
    setPlayAll(true);

    let index = 0;
    const playNext = () => {
      if (index >= sentences.length) {
        setPlayAll(false);
        return;
      }
      speakSentence(sentences[index], index, () => {
        index++;
        playNext();
      });
    };
    playNext();
  }, [sentences, speakSentence, stopSpeech]);

  const handleStop = useCallback(() => {
    stopSpeech();
    setPlayAll(false);
  }, [stopSpeech]);

  const handlePauseResume = useCallback(() => {
    if (playbackState === "playing") {
      pauseSpeech();
    } else if (playbackState === "paused") {
      resumeSpeech();
    }
  }, [playbackState, pauseSpeech, resumeSpeech]);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 sm:px-8">
      <div
        ref={containerRef}
        className="relative rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_2px_40px_-8px_rgba(0,0,0,0.08)] border border-neutral-200/60 overflow-hidden"
      >
        {playbackState === "idle" && !playAll ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your story here..."
            className="w-full min-h-[50vh] p-8 sm:p-10 text-lg sm:text-xl leading-relaxed sm:leading-8 text-neutral-800 bg-transparent resize-none focus:outline-none placeholder:text-neutral-300 font-[system-ui]"
            style={{ lineHeight: "1.9" }}
          />
        ) : (
          <div
            ref={displayRef}
            className="w-full min-h-[50vh] p-8 sm:p-10 text-lg sm:text-xl leading-relaxed sm:leading-8 text-neutral-800 select-text font-[system-ui]"
            style={{ lineHeight: "1.9" }}
          >
            {sentences.map((sentence, i) => (
              <span
                key={i}
                className={`transition-all duration-500 ease-out rounded-sm px-0.5 ${
                  playAll && currentSentenceIndex === i
                    ? "bg-amber-200/70 text-neutral-900"
                    : playAll && currentSentenceIndex > i
                    ? "text-neutral-400"
                    : ""
                }`}
              >
                {sentence}{" "}
              </span>
            ))}
          </div>
        )}
      </div>

      {selection.rect && playbackState === "idle" && !playAll && (
        <PlayButton
          rect={selection.rect}
          onPlay={handlePlaySelection}
        />
      )}

      <PlaybackControls
        playbackState={playbackState}
        speed={speed}
        playAll={playAll}
        onPause={handlePauseResume}
        onStop={handleStop}
        onPlayAll={handlePlayAll}
        onCycleSpeed={cycleSpeed}
      />

      {voices.length > 0 && (
        <VoiceSelector
          voices={voices}
          selectedVoice={selectedVoice}
          onSelect={setSelectedVoice}
        />
      )}
    </div>
  );
}
