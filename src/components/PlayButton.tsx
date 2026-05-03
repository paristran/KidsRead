"use client";

import { useEffect, useRef, useState } from "react";

interface PlayButtonProps {
  rect: DOMRect;
  onPlay: () => void;
}

export function PlayButton({ rect, onPlay }: PlayButtonProps) {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const top = rect.top + rect.height / 2 - 22 + window.scrollY;
  const left = rect.right + 12;

  return (
    <button
      ref={btnRef}
      onClick={onPlay}
      className={`fixed z-50 flex items-center justify-center w-11 h-11 rounded-full bg-neutral-900 text-white shadow-lg hover:bg-neutral-700 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-75"
      }`}
      style={{ top, left }}
      aria-label="Play selection"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="ml-0.5"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}
