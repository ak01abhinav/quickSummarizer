import { Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#020617] py-12 text-sm text-gray-500">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-6">
        <div className="flex flex-col gap-2">
          <p>© 2026 QuickSummary AI. Built with ❤️ by Abhinav.</p>
        </div>

        <div className="flex items-center gap-8">
          <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
          <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
          <a href="#" className="transition-colors hover:text-white">Contact</a>
          <a href="#" className="ml-4 transition-colors hover:text-white">
            <Twitter className="h-5 w-5 fill-current" />
          </a>
        </div>
      </div>
    </footer>
  );
}
