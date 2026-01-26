import { MessageSquare } from "lucide-react";

export default function FollowUpTeaser() {
  return (
    <section className="mx-auto mt-8 max-w-4xl px-6">
      <div className="flex items-center justify-between gap-4 rounded-2xl border bg-card p-4 backdrop-blur-sm border-dashed shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Follow-up Q&A{" "}
              <span className="text-xs text-muted-foreground">
                ( Under Development... )
              </span>
            </h4>
            <p className="text-xs text-muted-foreground">
              You'll be able to ask specific questions about your summarized
              content.
            </p>
          </div>
        </div>
        <button className="rounded-lg border bg-secondary/50 px-4 py-2 text-xs font-medium text-foreground transition-all hover:bg-secondary">
          Join Waitlist
        </button>
      </div>
    </section>
  );
}
