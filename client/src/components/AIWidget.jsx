import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Loader2, Sparkles, Send } from "lucide-react";
import { useAuth, useUser } from "@clerk/react";
import api from "../api/client.js";

const SUGGESTIONS = [
  "How do I buy a pet here?",
  "Is local pickup safe?",
  "How are prices set?"
];

export default function AIWidget() {
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your PetCare AI assistant. How can I help you with the marketplace today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = text.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const headers = isSignedIn ? { Authorization: `Bearer ${await getToken()}` } : {};
      const res = await api.post("/api/ai/chat", { message: userMsg }, { headers });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  const parseMarkdown = (text) => {
    // Very basic markdown parser for bold and newlines
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="card-glass flex h-96 w-80 animate-slide-right flex-col overflow-hidden rounded-[24px] shadow-premium sm:w-96">
          <div className="flex items-center justify-between bg-gradient-to-r from-ember/10 to-transparent px-5 py-4 border-b border-ink/5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ember text-white shadow-sm">
                <Sparkles size={16} />
              </span>
              <span className="font-semibold">AI Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full bg-white/50 p-1.5 text-ink/50 hover:bg-white hover:text-ink transition">
              <X size={16} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-ember text-white rounded-tr-sm"
                    : "bg-ink/5 text-ink/90 border border-ink/5 rounded-tl-sm"
                }`}>
                  {m.role === "assistant" ? parseMarkdown(m.content) : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-ink/5 px-4 py-3 border border-ink/5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            {!loading && messages.length === 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-ember/20 bg-ember/5 px-3 py-1.5 text-[11px] font-medium text-ember hover:bg-ember/10 transition">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-ink/5 bg-white/50 px-4 py-3">
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="relative flex items-center">
              <input
                className="w-full rounded-full border border-ink/10 bg-white py-2.5 pl-4 pr-10 text-sm focus:border-ember focus:outline-none focus:ring-1 focus:ring-ember/50 transition"
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" disabled={loading || !input.trim()} className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-ember text-white disabled:bg-ink/10 disabled:text-ink/40 hover:bg-ember/90 transition">
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-ember text-white shadow-premium transition-all hover:scale-110 active:scale-95 hover:shadow-lg"
        >
          <MessageSquare size={24} className="transition-transform group-hover:rotate-12" />
        </button>
      )}
    </div>
  );
}
