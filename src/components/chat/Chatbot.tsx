"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, User } from "lucide-react";
import { RiRobot3Line } from "react-icons/ri";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from "@/lib/utils"; // Assuming shadcn/ui utils is present based on styling. If not, will replace.
import { Button } from "@/components/ui/button"; // Assuming shadcn is present based on standard Nextjs tailwind setup.
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm the quickSummarizer assistant. How can I help you understand our features today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I am having trouble connecting right now.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 flex h-[70vh] max-h-[600px] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl transition-all duration-300 sm:h-[500px] sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-muted/50 p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <RiRobot3Line className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Summarizer AI</h3>
                <p className="text-xs text-muted-foreground">
                  Always here to help
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2 max-w-[85%]",
                  message.role === "user" ? "ml-auto flex-row-reverse" : "",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    message.role === "assistant"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {message.role === "assistant" ? (
                    <RiRobot3Line className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2 text-sm max-w-full break-words prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:p-0",
                    message.role === "assistant"
                      ? "bg-muted rounded-tl-none text-foreground"
                      : "bg-primary text-primary-foreground rounded-tr-none"
                  )}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ ...props }) => (
                        <a {...props} className="font-medium underline underline-offset-4 text-primary break-all" target="_blank" rel="noopener noreferrer" />
                      ),
                      p: ({ ...props }) => <p className="mb-2 last:mb-0 whitespace-pre-wrap leading-relaxed break-words" {...props} />,
                      ul: ({ ...props }) => <ul className="mb-2 ml-4 list-disc" {...props} />,
                      ol: ({ ...props }) => <ol className="mb-2 ml-4 list-decimal" {...props} />,
                      li: ({ ...props }) => <li className="mt-1" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <RiRobot3Line className="h-4 w-4" />
                </div>
                <div className="rounded-2xl bg-muted rounded-tl-none px-4 py-3 text-sm flex gap-1">
                  <span
                    className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4 bg-background">
            <form
              onSubmit={(e: React.FormEvent) => handleSubmit(e)}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 rounded-full"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                className="rounded-full shrink-0"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 p-0 rounded-full shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105 flex items-center justify-center"
        >
          <RiRobot3Line style={{ width: "22px", height: "22px" }} />
        </Button>
      )}
    </div>
  );
}
