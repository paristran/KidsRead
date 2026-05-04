"use client";

import { useState, useCallback, useRef } from "react";
import {
  speak,
  pause,
  resume,
  cancel,
  type PlaybackSpeed,
  type PlaybackState,
} from "@/lib/speech";

export type AppSpeed = 0.7 | 1;

export function useSpeech() {
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [speed, setSpeed] = useState<AppSpeed>(1);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speakText = useCallback(
    (text: string, onEnd?: () => void) => {
      setPlaybackState("playing");
      try {
        utteranceRef.current = speak(text, {
          rate: speed,
          pitch: 1.1,
          voice: null,
          onEnd: () => {
            setPlaybackState("idle");
            utteranceRef.current = null;
            onEnd?.();
          },
        });
      } catch {
        setPlaybackState("idle");
      }
    },
    [speed]
  );

  const speakSentence = useCallback(
    (text: string, index: number, onEnd?: () => void) => {
      setCurrentSentenceIndex(index);
      setPlaybackState("playing");
      try {
        utteranceRef.current = speak(text, {
          rate: speed,
          pitch: 1.1,
          voice: null,
          onEnd: () => {
            setPlaybackState("idle");
            utteranceRef.current = null;
            onEnd?.();
          },
        });
      } catch {
        setPlaybackState("idle");
        setCurrentSentenceIndex(-1);
      }
    },
    [speed]
  );

  const pauseSpeech = useCallback(() => {
    pause();
    setPlaybackState("paused");
  }, []);

  const resumeSpeech = useCallback(() => {
    resume();
    setPlaybackState("playing");
  }, []);

  const stopSpeech = useCallback(() => {
    cancel();
    setPlaybackState("idle");
    setCurrentSentenceIndex(-1);
    utteranceRef.current = null;
  }, []);

  const setSpeedNormal = useCallback(() => setSpeed(1), []);
  const setSpeedSlow = useCallback(() => setSpeed(0.7), []);

  return {
    playbackState,
    speed,
    currentSentenceIndex,
    speakText,
    speakSentence,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    setSpeedNormal,
    setSpeedSlow,
  };
}
