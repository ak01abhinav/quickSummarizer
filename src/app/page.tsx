"use client";

import { useState } from "react";
import Hero from "@/components/home/Hero";
import InputCard from "@/components/home/InputCard";
import SummaryOutput from "@/components/home/SummaryOutput";
import FollowUpTeaser from "@/components/home/FollowUpTeaser";
import RecentSummaries from "@/components/home/RecentSummaries";

export default function Page() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setSummary("");

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || "Failed to generate summary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Hero />
      <InputCard
        text={text}
        setText={setText}
        loading={loading}
        onSummarize={handleSummarize}
      />
      <SummaryOutput summary={summary} loading={loading} error={error} />
      <FollowUpTeaser />
      <RecentSummaries />
    </>
  );
}
