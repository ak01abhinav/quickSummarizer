import { FileText, Link as LinkIcon, Zap, ChevronDown } from "lucide-react";

export default function InputCard({
  onSummarize,
}: {
  onSummarize: () => void;
}) {
  return (
    <section className="mx-auto -mt-20 max-w-4xl px-6">
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#0b1220]/50 p-1 backdrop-blur-sm">
        <div className="rounded-xl bg-[#0b1220] p-6 shadow-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-bold tracking-wider text-blue-400">
            AI ENGINE READY
          </div>

          <textarea
            placeholder="Paste your content or drop a URL here..."
            className="h-48 w-full resize-none border-none bg-transparent p-0 text-lg text-white outline-none placeholder:text-gray-600 focus:ring-0"
          />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-6">
            <div className="flex items-center gap-4">
              <button className="text-gray-500 transition-colors hover:text-white">
                <FileText className="h-5 w-5" />
              </button>
              <button className="text-gray-500 transition-colors hover:text-white">
                <LinkIcon className="h-5 w-5" />
              </button>
              <div className="h-4 w-px bg-white/10 mx-2" />
              <button className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white">
                Concise Summary
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>

            <button
              onClick={onSummarize}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Summarize Now
              <Zap className="h-4 w-4 fill-current text-white/80" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
