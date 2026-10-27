"use client";

import { FormEvent, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! Welcome to BrightWeb Solutions. What would you like to know about our services?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = input.trim();

    if (!question || loading) return;

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to get a response.");
      }

      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <section className="mx-auto flex h-[75vh] min-h-[500px] max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <header className="bg-blue-700 p-5 text-white">
          <h1 className="text-xl font-bold">
            BrightWeb Assistant
          </h1>
          <p className="mt-1 text-sm text-blue-100">
            Ask us about our services
          </p>
        </header>

        <div
          className="flex-1 space-y-4 overflow-y-auto p-5"
          aria-live="polite"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user"
                  ? "justify-end"
                  : "justify-start"
                }`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm ${message.role === "user"
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-800"
                  }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <p className="text-sm text-slate-500" role="status">
              Assistant is thinking...
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 border-t p-4"
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask a question..."
            aria-label="Your message"
            maxLength={4000}
            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-blue-700 px-5 py-3 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </section>
    </main>
  );
}
