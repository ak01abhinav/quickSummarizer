"use client";

import { useState } from "react";
import Hero from "@/components/home/Hero";
import InputCard from "@/components/home/InputCard";
import SummaryOutput from "@/components/home/SummaryOutput";
import FollowUpTeaser from "@/components/home/FollowUpTeaser";
import RecentSummaries from "@/components/home/RecentSummaries";

export default function Page() {
  const [summary, setSummary] = useState("");

  return (
    <>
      <Hero />
      <InputCard
        onSummarize={() =>
          setSummary(
            "This is a mock summary. API integration will replace this later.",
          )
        }
      />
      <SummaryOutput summary={summary} />
      <FollowUpTeaser />
      <RecentSummaries />
    </>
  );
}
