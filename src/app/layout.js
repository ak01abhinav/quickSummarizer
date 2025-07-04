import "./globals.css";

export const metadata = {
  title: "QuickSummary",
  description: "Summarize text using AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
