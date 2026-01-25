import { LayoutDashboard, Hourglass, Copy, Bookmark } from "lucide-react";

export default function SummaryOutput({ summary }: { summary: string }) {
  return (
    <section className="mx-auto mt-12 max-w-4xl px-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <LayoutDashboard className="h-4 w-4 text-blue-500" />
          Summary Output
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <Copy className="h-4 w-4 hover:text-white cursor-pointer transition-colors" />
          <Bookmark className="h-4 w-4 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0b1220]/50 p-12 text-center backdrop-blur-sm">
        {summary ? (
          <p className="text-left text-gray-300 leading-relaxed">{summary}</p>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
              <Hourglass className="h-6 w-6 text-gray-600" />
            </div>
            <p className="text-sm text-gray-500">
              No summary generated yet. Paste some text above to get started.
            </p>
          </div>
        )}
        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500/20" />
      </div>
    </section>
  );
}
