import { MessageSquare } from "lucide-react";

export default function FollowUpTeaser() {
  return (
    <section className="mx-auto mt-8 max-w-4xl px-6">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#0b1220]/30 p-4 backdrop-blur-sm border-dashed">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
            <MessageSquare className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Follow-up Q&A <span className="text-xs text-gray-500">( Under Development... )</span></h4>
            <p className="text-xs text-gray-500">You'll be able to ask specific questions about your summarized content.</p>
          </div>
        </div>
        <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10">
          Join Waitlist
        </button>
      </div>
    </section>
  );
}
