import { FileText, Globe, ChevronRight } from "lucide-react";

const MOCK_SUMMARIES = [
  {
    title: "The Future of AI Design",
    time: "2 HOURS AGO",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Climate Change Report ...",
    time: "YESTERDAY",
    icon: Globe,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export default function RecentSummaries() {
  return (
    <section className="mx-auto mt-20 max-w-4xl px-6 pb-32">
      <h4 className="mb-6 text-center text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
        RECENT SUMMARIES ( Under Development... )
      </h4>

      <div className="grid gap-4 sm:grid-cols-2">
        {MOCK_SUMMARIES.map((item) => (
          <div
            key={item.title}
            className="group flex items-center justify-between rounded-2xl border bg-card p-4 transition-all hover:bg-secondary hover:border-primary/20 cursor-pointer shadow-md hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.bg}`}
              >
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h5>
                <p className="text-[10px] font-medium text-muted-foreground">
                  {item.time}
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </div>
        ))}
      </div>
    </section>
  );
}
