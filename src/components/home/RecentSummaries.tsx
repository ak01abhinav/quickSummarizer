import { FileText, Globe, ChevronRight } from "lucide-react";

const MOCK_SUMMARIES = [
  { title: "The Future of AI Design", time: "2 HOURS AGO", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
  { title: "Climate Change Report ...", time: "YESTERDAY", icon: Globe, color: "text-purple-400", bg: "bg-purple-500/10" },
];

export default function RecentSummaries() {
  return (
    <section className="mx-auto mt-20 max-w-4xl px-6 pb-32">
      <h4 className="mb-6 text-center text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
        RECENT SUMMARIES ( Under Development... )
      </h4>

      <div className="grid gap-4 sm:grid-cols-2">
        {MOCK_SUMMARIES.map((item) => (
          <div
            key={item.title}
            className="group flex items-center justify-between rounded-2xl border border-white/5 bg-[#0b1220]/50 p-4 transition-all hover:bg-[#0b1220] hover:border-white/10 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bg}`}>
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-white">{item.title}</h5>
                <p className="text-[10px] font-medium text-gray-600">{item.time}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-700 transition-colors group-hover:text-gray-400" />
          </div>
        ))}
      </div>
    </section>
  );
}
