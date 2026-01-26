import {
  LayoutDashboard,
  Hourglass,
  Copy,
  Bookmark,
  AlertCircle,
} from "lucide-react";

export default function SummaryOutput({
  summary,
  loading,
  error,
}: {
  summary: string;
  loading: boolean;
  error: string | null;
}) {
  return (
    <section className="mx-auto mt-12 max-w-4xl px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <LayoutDashboard className="h-4 w-4 text-primary" />
          Summary Output
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          <Copy
            className={`h-4 w-4 hover:text-foreground cursor-pointer transition-colors ${!summary && "opacity-20 pointer-events-none"}`}
            onClick={() => summary && navigator.clipboard.writeText(summary)}
          />
          <Bookmark
            className={`h-4 w-4 hover:text-foreground cursor-pointer transition-colors ${!summary && "opacity-20 pointer-events-none"}`}
          />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border bg-card p-12 text-center shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Hourglass className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">
              Gemini is thinking...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : summary ? (
          <p className="text-left text-foreground leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5">
              <Hourglass className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No summary generated yet. Paste some text above to get started.
            </p>
          </div>
        )}
        <div
          className={`absolute left-0 top-0 h-full w-1 transition-all duration-500 ${loading ? "bg-primary animate-pulse" : summary ? "bg-primary" : "bg-primary/20"}`}
        />
      </div>
    </section>
  );
}
