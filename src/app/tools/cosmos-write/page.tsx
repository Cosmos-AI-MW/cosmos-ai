"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "~/components/layout/Navbar";
import Footer from "~/components/layout/Footer";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import CosmicLoader from "~/components/ui/CosmicLoader";
import ReactMarkdown from "react-markdown";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("cosmos-write-session");
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem("cosmos-write-session", id);
  }
  return id;
}

const suggestions = [
  { label: "Business Email", prompt: "Write a professional business email " },
  { label: "Formal Letter", prompt: "Write a formal letter " },
  { label: "Business Proposal", prompt: "Write a business proposal " },
  { label: "Meeting Agenda", prompt: "Create a meeting agenda for " },
  { label: "Job Description", prompt: "Write a job description for " },
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function CosmosWritePage() {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limitReached, setLimitReached] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generate = api.write.generate.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.output },
      ]);
      setRemaining(data.remaining);
    },
    onError: (error) => {
      if (
        error.message.includes("FREE_LIMIT_REACHED") ||
        error.message.includes("ACCOUNT_LIMIT_REACHED")
      ) {
        setLimitReached(true);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Something went wrong. Please try again.",
          },
        ]);
      }
    },
  });

  function handleSend() {
    const text = input.trim();
    if (!text || !sessionId || generate.isPending) return;
    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    generate.mutate({
      documentType: "Chat",
      inputs: {
        message: text,
        history: JSON.stringify(messages.slice(-6)),
      },
      sessionId,
    });
  }

  function handleSuggestion(prompt: string) {
    setInput(prompt);
    textareaRef.current?.focus();
  }

  function handleCopy(index: number, content: string) {
    void navigator.clipboard.writeText(content);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <main className="bg-cosmos-chalk flex min-h-screen flex-col font-sans">
      <Navbar active="/tools/cosmos-write" />

      {/* HEADER */}
      <section className="bg-cosmos-forest px-6 py-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="text-cosmos-teal mb-2 text-sm font-medium tracking-widest uppercase">
            Cosmos Write
          </div>
          <h1 className="font-display mb-3 text-4xl font-semibold text-white">
            AI Business Writing Assistant
          </h1>
          <p className="text-cosmos-mist text-lg font-light">
            Describe what you need and get a professional document instantly.
          </p>
          {!limitReached && (
            <div className="border-cosmos-teal text-cosmos-teal mt-4 inline-block rounded-full border px-4 py-1 text-sm font-medium">
              {remaining === null
                ? session?.user &&
                  !(session.user as { isAdmin?: boolean }).isAdmin
                  ? `${(session.user as { generationsLimit?: number; generationsUsed?: number }).generationsLimit ?? 10} generations available this month`
                  : "3 free generations to try"
                : `${remaining} ${remaining === 1 ? "generation" : "generations"} remaining`}
            </div>
          )}
        </div>
      </section>

      {limitReached ? (
        <section className="flex flex-1 items-center justify-center px-6 py-20">
          <div className="mx-auto max-w-xl text-center">
            <div className="border-cosmos-silver rounded-2xl border bg-white p-12">
              <div className="mb-4 text-5xl">✉</div>
              <h2 className="font-display text-cosmos-forest mb-3 text-3xl font-semibold">
                Free generations used
              </h2>
              <p className="text-cosmos-forest mb-8 text-lg font-light">
                Get in touch with Cosmos AI to continue using Cosmos Write and
                explore options for your organisation.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/contact"
                  className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-8 py-3 text-base font-medium text-white transition-colors"
                >
                  Contact Cosmos AI
                </Link>
                <button
                  onClick={() => {
                    sessionStorage.removeItem("cosmos-write-session");
                    setSessionId(getSessionId());
                    setLimitReached(false);
                    setRemaining(3);
                    setMessages([]);
                  }}
                  className="border-cosmos-forest text-cosmos-forest hover:bg-cosmos-forest rounded-full border px-8 py-3 text-base font-medium transition-colors hover:text-white"
                >
                  Start New Session
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="flex flex-1 flex-col px-6 py-8">
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col">
            {/* SUGGESTIONS — show only when no messages */}
            {messages.length === 0 && (
              <div className="mb-8">
                <p className="text-cosmos-forest/60 mb-4 text-sm font-medium">
                  Quick start — click to use as a starting point:
                </p>
                <div className="flex flex-wrap gap-3">
                  {suggestions.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => handleSuggestion(s.prompt)}
                      className="border-cosmos-silver text-cosmos-forest hover:border-cosmos-teal hover:bg-cosmos-mist rounded-full border bg-white px-4 py-2 text-sm font-medium transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MESSAGES */}
            <div className="mb-6 flex-1 space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "user" ? (
                    <div className="bg-cosmos-forest max-w-lg rounded-2xl rounded-tr-sm px-5 py-3">
                      <p className="text-cosmos-mist text-base font-light">
                        {msg.content}
                      </p>
                    </div>
                  ) : (
                    <div className="border-cosmos-silver w-full rounded-2xl rounded-tl-sm border bg-white px-6 py-5">
                      <div className="prose prose-sm text-cosmos-forest prose-headings:font-display prose-headings:text-cosmos-forest prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:font-light prose-p:leading-relaxed prose-p:text-cosmos-forest prose-strong:font-medium prose-strong:text-cosmos-forest prose-ul:list-disc prose-ol:list-decimal prose-li:font-light prose-li:text-cosmos-forest prose-hr:border-cosmos-silver prose-a:text-cosmos-teal prose-a:no-underline hover:prose-a:underline prose-blockquote:border-cosmos-teal prose-blockquote:text-cosmos-forest/70 prose-code:text-cosmos-teal prose-code:bg-cosmos-mist prose-code:rounded prose-code:px-1 max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                      <div className="border-cosmos-silver mt-4 flex items-center gap-3 border-t pt-3">
                        <button
                          onClick={() => handleCopy(i, msg.content)}
                          className="border-cosmos-forest text-cosmos-forest hover:bg-cosmos-forest rounded-full border px-4 py-1.5 text-sm font-medium transition-colors hover:text-white"
                        >
                          {copied === i ? "✓ Copied" : "Copy"}
                        </button>
                        <button
                          onClick={() => {
                            setInput(`Please refine the document above — `);
                            textareaRef.current?.focus();
                            textareaRef.current?.setSelectionRange(9999, 9999);
                          }}
                          className="border-cosmos-silver text-cosmos-forest/60 hover:border-cosmos-forest hover:text-cosmos-forest rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
                        >
                          ✴ Refine
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {generate.isPending && (
                <div className="flex justify-start">
                  <div className="border-cosmos-silver rounded-2xl rounded-tl-sm border bg-white">
                    <CosmicLoader />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div className="border-cosmos-silver rounded-2xl border bg-white p-4 shadow-sm">
              <textarea
                ref={textareaRef}
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe what you need... e.g. Write a professional email to a bank manager requesting a business loan meeting"
                className="text-cosmos-forest placeholder:text-cosmos-forest/30 w-full resize-none text-base font-light outline-none"
              />
              <div className="mt-3 flex items-center justify-between">
                <p className="text-cosmos-forest/40 text-xs font-light">
                  Press Enter to send · Shift+Enter for new line
                </p>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || generate.isPending}
                  className="bg-cosmos-accent hover:bg-cosmos-forest-light rounded-full px-6 py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {generate.isPending ? "Writing..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
