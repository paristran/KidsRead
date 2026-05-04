"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { splitSentences } from "@/lib/sentences";
import { useSpeech } from "@/hooks/useSpeech";
import { PlayButton } from "./PlayButton";
import { PlaybackControls } from "./PlaybackControls";
import { VoiceSelector } from "./VoiceSelector";
import { PronunciationView } from "./PronunciationView";

export function TextEditor() {
  const [text, setText] = useState(
    `The quick brown fox jumps over the lazy dog. She smiled and said, "Today is a beautiful day!" The children ran through the meadow, laughing and playing tag.\n\nOnce upon a time, there was a little star who lived in the sky. Every night, it would twinkle and shine, watching over the world below. "I want to make everyone happy," whispered the little star.\n\nThe old owl sat on the branch and hooted softly. "Who goes there?" he asked. The little rabbit hopped by and replied, "It's just me, Mr. Owl! I'm looking for carrots."`
  );
  const [selectedText, setSelectedText] = useState("");
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [playAll, setPlayAll] = useState(false);
  const [showPronunciation, setShowPronunciation] = useState(false);
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
  const isPlaying = playbackState === "playing" || playbackState === "paused";

  // Handle selection from the display div (uses window.getSelection)
  const handleDocumentSelectionChange = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      // Only clear if not focused on textarea (textarea handles its own)
      if (document.activeElement !== textareaRef.current) {
        setSelectedText("");
        setSelectionRect(null);
      }
      return;
    }

    // Don't capture textarea selection here — handled in onSelect
    if (document.activeElement === textareaRef.current) return;

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setSelectedText(sel.toString().trim());
    setSelectionRect(rect);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", handleDocumentSelectionChange);
    return () => document.removeEventListener("selectionchange", handleDocumentSelectionChange);
  }, [handleDocumentSelectionChange]);

  // Handle selection from the textarea (uses selectionStart/selectionEnd)
  const handleTextareaSelect = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start === end) {
      setSelectedText("");
      setSelectionRect(null);
      return;
    }

    const selected = text.substring(start, end).trim();
    if (!selected) {
      setSelectedText("");
      setSelectionRect(null);
      return;
    }

    setSelectedText(selected);

    // Get rect from textarea position
    const rect = getCaretRect(el, start, end);
    setSelectionRect(rect);
  }, [text]);

  // Compute a DOMRect-like object for the textarea selection
  function getCaretRect(el: HTMLTextAreaElement, start: number, end: number): DOMRect | null {
    const mirror = document.createElement("div");
    const computed = getComputedStyle(el);

    mirror.style.position = "absolute";
    mirror.style.visibility = "hidden";
    mirror.style.whiteSpace = "pre-wrap";
    mirror.style.wordWrap = "break-word";
    mirror.style.overflow = "hidden";
    mirror.style.width = computed.width;
    mirror.style.height = computed.height;
    mirror.style.padding = computed.padding;
    mirror.style.border = computed.border;
    mirror.style.fontFamily = computed.fontFamily;
    mirror.style.fontSize = computed.fontSize;
    mirror.style.lineHeight = computed.lineHeight;
    mirror.style.letterSpacing = computed.letterSpacing;

    mirror.textContent = text.substring(0, start);
    const span = document.createElement("span");
    span.textContent = text.substring(start, end);
    mirror.appendChild(span);

    // Add remainder to get correct wrapping
    const tail = document.createElement("span");
    tail.textContent = text.substring(end);
    mirror.appendChild(tail);

    document.body.appendChild(mirror);

    const spanRect = span.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    document.body.removeChild(mirror);

    if (spanRect.width === 0 && spanRect.height === 0) return null;

    return new DOMRect(
      spanRect.left,
      spanRect.top,
      spanRect.width,
      spanRect.height
    );
  }

  const handlePlaySelection = useCallback(() => {
    if (!selectedText) return;
    stopSpeech();
    setPlayAll(false);
    speakText(selectedText);
    // Clear selection visual after playing
    setTimeout(() => {
      setSelectedText("");
      setSelectionRect(null);
    }, 300);
  }, [selectedText, speakText, stopSpeech]);

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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      <div className="flex gap-4">
        {/* Main text area */}
        <div className="flex-1 min-w-0">
          <div
            ref={containerRef}
            className="relative rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_2px_40px_-8px_rgba(0,0,0,0.08)] border border-neutral-200/60 overflow-hidden"
          >
            {playbackState === "idle" && !playAll ? (
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onSelect={handleTextareaSelect}
                onMouseUp={handleTextareaSelect}
                onKeyUp={handleTextareaSelect}
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
        </div>

        {/* Pronunciation column */}
        {showPronunciation && (
          <div className="hidden md:block w-[320px] flex-shrink-0">
            <div className="rounded-2xl bg-white/80 backdrop-blur-xl shadow-[0_2px_40px_-8px_rgba(0,0,0,0.08)] border border-neutral-200/60 overflow-hidden p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
              <h3 className="text-xs font-medium text-neutral-300 uppercase tracking-wider mb-4">
                Pronunciation Guide
              </h3>
              <PronunciationView
                text={text}
                currentSentenceIndex={currentSentenceIndex}
                playing={isPlaying && playAll}
              />
            </div>
          </div>
        )}
      </div>

      {selectedText && selectionRect && (
        <PlayButton
          rect={selectionRect}
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
        showPronunciation={showPronunciation}
        onTogglePronunciation={() => setShowPronunciation((p) => !p)}
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
