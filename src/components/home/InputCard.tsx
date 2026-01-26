import {
  FileText,
  Link as LinkIcon,
  Zap,
  ChevronDown,
  Loader2,
} from "lucide-react";

export default function InputCard({
  onSummarize,
  text,
  setText,
  loading,
}: {
  onSummarize: () => void;
  text: string;
  setText: (text: string) => void;
  loading: boolean;
}) {
  return (
    <section className="mx-auto -mt-20 max-w-4xl px-6">
      <div className="overflow-hidden rounded-2xl border bg-secondary/50 p-1 backdrop-blur-sm shadow-2xl">
        <div className="rounded-xl bg-card p-6 shadow-xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold tracking-wider text-primary">
            AI ENGINE READY
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content or drop a URL here..."
            className="h-48 w-full resize-none border-none bg-transparent p-0 text-lg text-foreground outline-none placeholder:text-muted-foreground focus:ring-0"
            disabled={loading}
          />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
            <div className="flex items-center gap-4">
              <button
                className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                disabled={loading}
              >
                <FileText className="h-5 w-5" />
              </button>
              <button
                className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                disabled={loading}
              >
                <LinkIcon className="h-5 w-5" />
              </button>
              <div className="h-4 w-px bg-border mx-2" />
              <button
                className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
                disabled={loading}
              >
                Concise Summary
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>

            <button
              onClick={onSummarize}
              disabled={loading || !text.trim()}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  Summarizing...
                  <Loader2 className="h-4 w-4 animate-spin text-white/80" />
                </>
              ) : (
                <>
                  Summarize Now
                  <Zap className="h-4 w-4 fill-current text-white/80" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
