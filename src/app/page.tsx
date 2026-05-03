import { TextEditor } from "@/components/TextEditor";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center py-8 sm:py-12 lg:py-16">
      <header className="text-center mb-8 sm:mb-12 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-900">
          KidsRead
        </h1>
        <p className="mt-3 text-base sm:text-lg text-neutral-400 max-w-md mx-auto">
          Paste a story. Highlight any sentence. Tap play to listen.
        </p>
      </header>

      <div className="w-full animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        <TextEditor />
      </div>

      <footer className="mt-12 text-center text-xs text-neutral-300">
        Built with Web Speech API &middot; No data leaves your browser
      </footer>
    </main>
  );
}
