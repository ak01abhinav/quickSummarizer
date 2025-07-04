"use client"; // This makes the component run on the client-side (browser) in Next.js 13+ App Router

import { useState } from "react"; // Import React hook to manage component state

export default function Home() {
  // State for the input textarea
  const [input, setInput] = useState("");

  // State for the summary output box
  const [summary, setSummary] = useState("");

  // Function that runs when the "Summarize" button is clicked
  const handleSummarize = async () => {
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setSummary("❌ Something went wrong.");
      console.error(err);
    }
  };

  return (
    <div>
      {/* 🔷 HEADER SECTION */}
      <header className="header">
        {/* Left side: App name */}
        <div className="logo">QuickSummary</div>

        {/* Right side: Navigation links */}
        <nav className="nav-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      {/* 🔷 MAIN CONTENT SECTION */}
      <main>
        {/* App welcome heading */}
        <h1 style={{ textAlign: "center" }}>
          Welcome to <strong>QuickSummary</strong>
        </h1>

        {/* Textarea for user to paste their content to summarize */}
        <textarea
          placeholder="Paste your content here..."
          rows={8}
          value={input}
          onChange={(e) => setInput(e.target.value)} // Updates input state as user types
        />

        {/* Summarize button */}
        <div style={{ textAlign: "center" }}>
          <button onClick={handleSummarize}>Summarize</button>
        </div>

        {/* Summary output box */}
        <div className="summary-box">
          <h3>Summary:</h3>

          {/* Show summary if available, otherwise show placeholder message */}
          <p>
            {summary ||
              "Summary will appear here after user hits the button..."}
          </p>
        </div>

        {/* Follow-up placeholder section */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p className="text-sm text-blue-200 italic">
            🔄 Follow-up Q&A coming soon…
          </p>
          <p style={{ fontSize: "0.85rem", color: "#334155" }}>
            You’ll be able to ask anything after summarizing your content.
          </p>
        </div>

        {/* Footer section */}
        <footer>
          <p>Built with ❤️ by Abhinav</p>
        </footer>
      </main>
    </div>
  );
}
