# KidsRead

A modern, minimal reading app for kids inspired by Apple and Tesla design language. Paste any story, highlight text, and listen to it read aloud in a natural, kid-friendly voice.

Built with Next.js, React, Tailwind CSS, and the Web Speech API. Zero backend required — everything runs in the browser.

---

## Features

### Text Input
- Large, clean text area for pasting or typing multi-line text (poems, stories, articles)
- Auto-detects sentences using punctuation (`.`, `!`, `?`)
- Pre-loaded with sample stories to get started immediately

### Highlight & Play (Key Feature)
- Highlight any word or sentence with mouse/touch
- A floating play button appears near the selection
- Tap to hear it spoken aloud instantly
- No selection? Hit "Play All" to read the entire text

### Play All Mode
- Reads text sentence-by-sentence
- Live amber highlighting on the current sentence
- Completed sentences fade out for visual flow

### Pronunciation Guide
- Toggle a side panel showing each word with its **IPA phonetic transcription**
- Pronunciations fetched from a free dictionary API with in-memory caching
- Current sentence highlighted during playback

### Playback Controls
- **Speed toggle**: 🐢 Slow (0.7x) / 🙂 Normal (1x) / ⚡ Fast (1.3x)
- **Pause / Resume / Stop** buttons
- **Voice selector** dropdown — choose from available system voices
- Kid-friendly defaults: prefers warm female voices with slightly higher pitch

### UI/UX
- Apple/Tesla-inspired minimal design
- Lots of whitespace, large readable typography
- Smooth fade-in and scale animations
- Floating controls (iOS selection-style)
- Fully responsive — works on mobile and desktop

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Language | TypeScript |
| Speech | Web Speech API (native browser TTS) |
| Pronunciation | [Free Dictionary API](https://dictionaryapi.dev/) |

---

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles, animations, scrollbar
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Home page
├── components/
│   ├── TextEditor.tsx       # Main component — text area, selection, playback
│   ├── PlayButton.tsx       # Floating play button near selection
│   ├── PlaybackControls.tsx # Play All, Pause, Stop, Speed, Pronunciation toggle
│   ├── PronunciationView.tsx# Side panel with word → IPA table
│   └── VoiceSelector.tsx    # Voice dropdown
├── hooks/
│   └── useSpeech.ts         # React hook wrapping Web Speech API
└── lib/
    ├── speech.ts            # Speech synthesis helpers (speak, pause, cancel, voices)
    ├── sentences.ts         # Sentence splitting and position mapping
    └── pronunciation.ts     # Dictionary API client with caching
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
git clone git@github.com:paristran/KidsRead.git
cd KidsRead
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Web Speech API** over cloud TTS | Zero cost, no backend, instant playback, works offline |
| **No external state management** | React hooks are sufficient for this scope — no Zustand needed |
| **Client-side only** | Entire app runs in the browser with zero API keys or server |
| **Free Dictionary API** for pronunciation | No auth required, reliable IPA transcriptions, easy to cache |
| **Tailwind CSS** for styling | Rapid prototyping with utility classes, easy to maintain |
| **App Router** (Next.js) | Latest recommended approach, better code splitting |

---

## Component Details

### `TextEditor` — Main Component
Manages the full reading experience: text input, selection detection, playback state, and pronunciation toggle. Switches between textarea (edit mode) and highlighted sentence display (playback mode).

### `PlayButton` — Floating Selection Button
Detects `selectionchange` events, extracts selected text, and renders a floating play button at the selection rect. Animates in with a scale + fade transition.

### `PlaybackControls` — Control Bar
Play All, Pause/Resume, Stop, Speed toggle, and Pronunciation toggle. Uses pill-shaped buttons with Apple-style hover and active states.

### `PronunciationView` — Pronunciation Side Panel
Splits text into sentences and words, fetches IPA transcriptions in parallel (batched, cached), and renders a clean word | pronunciation table. Highlights the current sentence during Play All.

### `useSpeech` — Speech Hook
Wraps the Web Speech API into a clean React hook. Manages playback state, speed, voice selection, and sentence-by-sentence queuing for Play All mode.

---

## Limitations

- **Voice availability** depends on the browser and OS — Safari/macOS has the best kid-friendly voices (Samantha, Karen)
- **Web Speech API** is not available in all browsers (works in Chrome, Safari, Edge; not Firefox on some platforms)
- **No persistence** — text is lost on page refresh (could add localStorage)
- **Sentence detection** uses basic punctuation splitting — may not handle abbreviations or dialog perfectly
- **Pronunciation API** requires internet — works only when online (Web Speech itself works offline)

---

## Testing Scenarios

| Scenario | Expected Behavior |
|----------|------------------|
| Highlight single word | Floating play button appears, plays only that word |
| Highlight full sentence | Plays the selected sentence |
| No highlight + Play All | Reads entire text sentence-by-sentence with highlighting |
| Speed toggle during playback | Changes speed for the next utterance |
| Mobile touch selection | Works the same as mouse selection |
| Long text (100+ lines) | Performs smoothly, no lag |
| Toggle pronunciation | Side panel shows/hides with word → IPA table |

---

## Deployment (Vercel)

### Option 1: CLI
```bash
npx vercel login
npx vercel --yes
```

### Option 2: GitHub Integration
1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Deploy — zero configuration needed

---

## Future Enhancements

- [ ] Word-by-word highlighting (karaoke style)
- [ ] Save reading sessions (localStorage)
- [ ] Kid mode UI (bigger buttons, colorful theme)
- [ ] Multi-language support
- [ ] Offline pronunciation dictionary (embedded)
- [ ] Reading progress tracking
- [ ] Text import from files (.txt, .pdf)

---

## License

MIT
