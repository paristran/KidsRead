"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  speak,
  pause,
  resume,
  cancel,
  loadVoices,
  type PlaybackSpeed,
  type PlaybackState,
} from "@/lib/speech";

export function useSpeech() {
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    loadVoices().then((v) => {
      setVoices(v);
    });
  }, []);

  const speakText = useCallback(
    (text: string, onEnd?: () => void) => {
      setPlaybackState("playing");
      try {
        utteranceRef.current = speak(text, {
          rate: speed,
          pitch: 1.1,
          voice: selectedVoice,
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
    [speed, selectedVoice]
  );

  const speakSentence = useCallback(
    (text: string, index: number, onEnd?: () => void) => {
      setCurrentSentenceIndex(index);
      setPlaybackState("playing");
      try {
        utteranceRef.current = speak(text, {
          rate: speed,
          pitch: 1.1,
          voice: selectedVoice,
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
    [speed, selectedVoice]
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

  const cycleSpeed = useCallback(() => {
    setSpeed((prev) => {
      if (prev === 0.7) return 1;
      if (prev === 1) return 1.3;
      return 0.7;
    });
  }, []);

  return {
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
  };
}
