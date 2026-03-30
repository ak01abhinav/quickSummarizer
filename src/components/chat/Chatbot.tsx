"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, User, Plus, History, Trash2, ChevronLeft } from "lucide-react";
import { RiRobot3Line } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatSession = {
  id: string;
  messages: Message[];
  title: string;
  updatedAt: number;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const historyPanelRef = useRef<HTMLDivElement>(null);
  const historyToggleButtonRef = useRef<HTMLButtonElement>(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      // 1. Check if clicked completely outside the chat window
      if (isOpen && chatWindowRef.current && !chatWindowRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
      
      // 2. Check if clicked outside history panel but INSIDE chat window
      if (
        isOpen && 
        showHistory && 
        chatWindowRef.current?.contains(e.target as Node) && 
        historyPanelRef.current && !historyPanelRef.current.contains(e.target as Node) &&
        historyToggleButtonRef.current && !historyToggleButtonRef.current.contains(e.target as Node)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen, showHistory]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("quick_summarizer_chats");
    const lastActiveId = localStorage.getItem("quick_summarizer_active_chat");
    
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed);
      if (lastActiveId && parsed.some((s: ChatSession) => s.id === lastActiveId)) {
        setActiveSessionId(lastActiveId);
      } else if (parsed.length > 0) {
        setActiveSessionId(parsed[0].id);
      }
    } else {
      // Create first session if none exists
      createNewChat();
    }
    
    const wasOpen = localStorage.getItem("quick_summarizer_chat_open");
    if (wasOpen === "true") setIsOpen(true);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("quick_summarizer_chats", JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem("quick_summarizer_active_chat", activeSessionId);
    }
  }, [activeSessionId]);

  useEffect(() => {
    localStorage.setItem("quick_summarizer_chat_open", isOpen.toString());
  }, [isOpen]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  const messages = activeSession?.messages || [];

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      updatedAt: Date.now(),
      messages: [
        {
          role: "assistant" as const,
          content: "Hi! I'm the quickSummarizer assistant. How can I help you today?",
        },
      ],
    };
    // Strict limit to top 5 most recent sessions
    setSessions((prev) => [newSession, ...prev].slice(0, 5));
    setActiveSessionId(newSession.id);
    setShowHistory(false);
  };

  const clearChat = () => {
    if (!activeSessionId) return;
    setSessions((prev) => 
      prev.map(s => s.id === activeSessionId ? {
        ...s,
        messages: [{
          role: "assistant" as const,
          content: "Hi! I'm the quickSummarizer assistant. How can I help you today?",
        }],
        title: "New Chat",
        updatedAt: Date.now()
      } : s).slice(0, 5)
    );
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    // Trigger animation first
    setDeletingSessionId(id);
    
    // Wait for animation to finish before removing from state
    setTimeout(() => {
      setSessions((prev) => {
        const remaining = prev.filter(s => s.id !== id);
        
        if (activeSessionId === id) {
          if (remaining.length > 0) {
            setActiveSessionId(remaining[0].id);
          } else {
            setActiveSessionId(null);
          }
        }
        return remaining;
      });
      setDeletingSessionId(null);
    }, 300); // 300ms delay matches our duration-300 transition
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeSessionId) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    // Update session immediately for UI and keep within 5 count
    setSessions((prev) => {
      const updated = prev.map(s => s.id === activeSessionId ? {
        ...s, 
        messages: updatedMessages,
        title: input.slice(0, 30) + (input.length > 30 ? "..." : ""),
        updatedAt: Date.now()
      } : s);
      return updated.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
    });
    
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const assistantMessage: Message = { role: "assistant", content: data.reply };
      
      setSessions((prev) => {
        const updated = prev.map(s => s.id === activeSessionId ? {
          ...s, 
          messages: [...updatedMessages, assistantMessage],
          updatedAt: Date.now()
        } : s);
        return updated.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
      });
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { 
        role: "assistant", 
        content: "Sorry, I am having trouble connecting right now." 
      };
      setSessions((prev) => 
        prev.map(s => s.id === activeSessionId ? {
          ...s, 
          messages: [...updatedMessages, errorMessage],
          updatedAt: Date.now()
        } : s).slice(0, 5)
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <div 
        ref={chatWindowRef}
        className={cn(
          "absolute bottom-0 right-0 flex h-[85vh] max-h-[750px] w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border bg-background shadow-2xl transition-all duration-500 ease-out sm:w-[500px] md:w-[550px] origin-bottom-right",
          isOpen 
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 scale-[0.5] translate-y-20 pointer-events-none"
        )}
      >
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-muted/30 p-5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10">
                <RiRobot3Line className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">Summarizer AI</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Active Now
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                ref={historyToggleButtonRef}
                variant="ghost"
                size="icon"
                title="Chat History"
                className={cn("h-9 w-9 rounded-full", showHistory && "bg-primary/10 text-primary")}
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="New Chat"
                className="h-9 w-9 rounded-full"
                onClick={createNewChat}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Minimize"
                className="h-9 w-9 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <div className="font-bold text-lg select-none">−</div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Close and Reset"
                className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden flex min-h-0">
            {/* History Panel - Always in DOM with translate-x for animations */}
            <div 
              ref={historyPanelRef}
              className={cn(
                "absolute inset-0 z-20 bg-background/95 backdrop-blur-md border-r w-80 shadow-2xl transition-transform duration-500 ease-in-out",
                showHistory ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <div className="flex flex-col h-full">
                <div className="p-5 border-b flex items-center justify-between bg-muted/20 shrink-0">
                  <h4 className="text-sm font-bold tracking-tight">Recent Conversations</h4>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-xl hover:bg-muted" 
                    onClick={() => setShowHistory(false)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {sessions.map((session) => (
                      <div 
                        key={session.id} 
                        className={cn(
                          "relative group/item mb-1 transition-all duration-300",
                          deletingSessionId === session.id && "opacity-0 scale-95 -translate-x-4 grayscale"
                        )}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            if (deletingSessionId) return;
                            setActiveSessionId(session.id);
                            setShowHistory(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              if (deletingSessionId) return;
                              setActiveSessionId(session.id);
                              setShowHistory(false);
                            }
                          }}
                          className={cn(
                            "w-full text-left p-4 rounded-2xl text-sm transition-all duration-300 group/btn relative border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                            activeSessionId === session.id 
                              ? "bg-primary text-primary-foreground border-primary shadow-md scale-[0.98]" 
                              : "hover:bg-muted border-transparent hover:border-muted-foreground/10"
                          )}
                        >
                          <p className="font-semibold truncate pr-2">{session.title}</p>
                          <div className="flex items-center justify-between mt-2 h-5">
                            <p className={cn(
                              "text-[10px] font-medium leading-none",
                              activeSessionId === session.id ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {new Date(session.updatedAt).toLocaleDateString()}
                            </p>
                            
                            {/* Icon Container with Swap Effect */}
                            <div className="relative h-5 w-5 flex items-center justify-center">
                              <History className={cn(
                                "h-3.5 w-3.5 transition-all duration-200",
                                activeSessionId === session.id ? "opacity-100" : "opacity-30",
                                "group-hover/item:opacity-0 group-hover/item:scale-0"
                              )} />
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={deletingSessionId !== null}
                                className={cn(
                                  "absolute inset-0 h-6 w-6 rounded-md p-1 transition-all duration-200 opacity-0 scale-50 translate-y-1 z-10 group-hover/item:opacity-100 group-hover/item:scale-100 group-hover/item:translate-y-0",
                                  activeSessionId === session.id 
                                    ? "text-primary-foreground hover:bg-primary-foreground/20" 
                                    : "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                )}
                                onClick={(e) => deleteSession(e, session.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  {sessions.length === 0 && (
                    <div className="py-10 text-center space-y-2">
                      <History className="h-8 w-8 mx-auto text-muted-foreground/20" />
                      <p className="text-xs text-muted-foreground">No recent chats</p>
                    </div>
                  )}
                </div>
                <div className="p-5 border-t bg-muted/5 shrink-0">
                  <Button className="w-full justify-center gap-2 h-11 rounded-2xl shadow-sm" onClick={createNewChat}>
                    <Plus className="h-4 w-4" /> Start New Chat
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
              {/* Toolbar */}
              <div className="px-6 py-3 border-b bg-muted/5 flex justify-between items-center h-12 shrink-0">
                <div className="flex items-center gap-2 overflow-hidden">
                   <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                   <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.1em] truncate">
                    {activeSession?.title || "Current Session"}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearChat}
                  className="h-8 px-3 text-[11px] font-semibold gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Reset Chat
                </Button>
              </div>

              {/* Messages - Multi-chat Sweep/Reset View */}
              <div 
                key={activeSessionId}
                className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar animate-in fade-in duration-700 h-full"
              >
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-4 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500",
                      message.role === "user" ? "ml-auto flex-row-reverse max-w-[92%]" : "max-w-[92%]",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-[1.2rem] shadow-sm ring-1",
                        message.role === "assistant"
                          ? "bg-primary text-primary-foreground ring-primary/20"
                          : "bg-muted text-muted-foreground ring-muted-foreground/10",
                      )}
                    >
                      {message.role === "assistant" ? (
                        <RiRobot3Line className="h-5 w-5" />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "rounded-[1.5rem] px-5 py-4 text-[15px] shadow-sm ring-1 ring-inset leading-relaxed",
                        message.role === "assistant"
                          ? "bg-card ring-muted/50 rounded-tl-none text-foreground"
                          : "bg-primary ring-primary/30 text-primary-foreground rounded-tr-none",
                      )}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ ...props }) => (
                            <a
                              {...props}
                              className="font-bold underline underline-offset-4 text-inherit decoration-primary/30"
                              target="_blank"
                              rel="noopener noreferrer"
                            />
                          ),
                          p: ({ ...props }) => (
                            <p className="mb-3 last:mb-0" {...props} />
                          ),
                          ul: ({ ...props }) => (
                            <ul className="mb-4 ml-5 list-disc space-y-2" {...props} />
                          ),
                          ol: ({ ...props }) => (
                            <ol className="mb-4 ml-5 list-decimal space-y-2" {...props} />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start gap-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[1.2rem] bg-primary text-primary-foreground shadow-sm">
                      <RiRobot3Line className="h-6 w-6 animate-pulse" />
                    </div>
                    <div className="rounded-[1.5rem] bg-muted/30 ring-1 ring-muted/20 rounded-tl-none px-6 py-5 flex flex-col gap-2">
                       <div className="flex gap-1.5 px-1">
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce shadow-[0_0_8px_rgba(var(--primary),0.5)]" style={{ animationDelay: "0ms" }}></span>
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce shadow-[0_0_8px_rgba(var(--primary),0.5)]" style={{ animationDelay: "150ms" }}></span>
                        <span className="h-2 w-2 rounded-full bg-primary animate-bounce shadow-[0_0_8px_rgba(var(--primary),0.5)]" style={{ animationDelay: "300ms" }}></span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-primary/60 animate-pulse">Thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-6 bg-background/50 backdrop-blur-sm border-t shrink-0">
            <form
              onSubmit={handleSubmit}
              className="relative flex items-center group"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-[1.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <Input
                disabled={isTyping}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isTyping ? "AI is processing your request..." : "Ask me anything about your documents..."}
                className={cn(
                  "flex-1 rounded-[1.5rem] h-14 pl-6 pr-14 bg-muted/40 border-2 border-transparent focus-visible:border-primary/50 focus-visible:ring-0 transition-all text-base shadow-inner relative z-10",
                  isTyping && "opacity-50 cursor-not-allowed"
                )}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                className={cn(
                  "absolute right-2 h-10 w-10 rounded-[1.1rem] shadow-xl transition-all z-20",
                  isTyping ? "bg-muted translate-y-px" : "hover:scale-105 active:scale-95"
                )}
              >
                {isTyping ? (
                   <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </form>
            <div className="flex justify-center items-center gap-4 mt-4">
              <div className="h-[1px] flex-1 bg-muted/50" />
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-30">
                Next-Gen Summarization
              </p>
              <div className="h-[1px] flex-1 bg-muted/50" />
            </div>
          </div>
        </div>
      {/* </div>  <- Note: The outermost wrapper is already closed by line 570 */}

      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "absolute bottom-0 right-0 h-16 w-16 p-0 rounded-[2rem] shadow-2xl hover:shadow-primary/40 transition-all duration-500 hover:scale-110 flex items-center justify-center group bg-primary overflow-hidden",
          isOpen 
            ? "opacity-0 scale-50 pointer-events-none rotate-90" 
            : "opacity-100 scale-100 pointer-events-auto rotate-0"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary-foreground/10 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <RiRobot3Line className="h-7 w-7 text-primary-foreground relative z-10 group-hover:rotate-12 transition-transform duration-500" />
        
        {/* Recent Badge if messages exist */}
        {sessions.length > 0 && messages.length > 1 && (
          <span className="absolute top-2 right-2 h-3 w-3 bg-red-500 rounded-full border-2 border-primary z-20" />
        )}
      </Button>
    </div>
  );
}

