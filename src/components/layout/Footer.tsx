import { Linkedin } from "lucide-react";
import { Mail } from "lucide-react";

interface ContactDetails {
  email: string;
  linkedIn: string;
}

export default function Footer() {
  const contactDetails: ContactDetails = {
    email: "abhinav01.ak@gmail.com",
    linkedIn: "https://www.linkedin.com/in/ak01abhinav/",
  };
  return (
    <footer className="border-t bg-background py-12 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-6">
        <div className="flex flex-col gap-2">
          <p>© 2026 QuickSummary AI. Built with ❤️ by Abhinav.</p>
        </div>

        <div className="flex items-center gap-8">
          <a href="#" className="transition-colors hover:text-foreground">
            Privacy Policy
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Terms of Service
          </a>
          <a href="#" className="transition-colors hover:text-foreground">
            Contact
          </a>
          <a
            href={contactDetails.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 transition-colors hover:text-foreground"
          >
            <Linkedin className="h-5 w-5 text-blue-500" />
          </a>
          <a
            href={`mailto:${contactDetails.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 transition-colors hover:text-foreground"
          >
            <Mail className="h-5 w-5 " />
          </a>
        </div>
      </div>
    </footer>
  );
}
