# KidsRead

A modern, minimal reading app for kids. Paste any story, highlight text, and listen to it read aloud.

## Features

- **Text Input** — Paste or type multi-line text (poems, stories, articles)
- **Highlight to Play** — Select any word or sentence, tap the floating play button
- **Play All** — Read entire text sentence-by-sentence with live highlighting
- **Speed Control** — Toggle between Slow (0.7x), Normal (1x), and Fast (1.3x)
- **Voice Selection** — Choose from available system voices
- **Kid-Friendly** — Prefers warm, natural voices with slightly higher pitch

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **TypeScript**
- **Web Speech API** (built-in browser TTS, no backend required)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Design Decisions

- **Web Speech API** over cloud TTS — zero cost, no backend, instant playback, works offline
- **No external state management** — React hooks suffice for this scope
- **Apple/Tesla-inspired UI** — lots of whitespace, smooth animations, minimal chrome
- **Client-side only** — the entire app runs in the browser with zero API calls

## Limitations

- Voice availability depends on the browser and OS (Safari/macOS has the best voices)
- Web Speech API is not available in all browsers (works in Chrome, Safari, Edge)
- No persistence — text is lost on page refresh (could add localStorage)
- Sentence detection uses basic punctuation splitting (., !, ?)

## Deploy on Vercel

```bash
npx vercel --yes
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new).
