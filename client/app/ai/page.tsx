"use client";
import { useState, useRef, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { ai, ChatMessage, AiSettings } from "@/lib/api";
import { Bot, Send, User, Loader2, AlertCircle, Sparkles } from "lucide-react";

const ANALYSIS_TYPES = [
  { key: "general",   label: "General Q&A" },
  { key: "risk",      label: "Risk Analysis" },
  { key: "rebalance", label: "Rebalancing" },
  { key: "tax",       label: "Tax Planning" },
  { key: "sector",    label: "Sector Diversification" },
];

const STARTER_PROMPTS = [
  "Give me an overview of my portfolio performance",
  "Which of my holdings have the highest risk?",
  "How should I rebalance my portfolio?",
  "What are the tax implications of selling my top gainers?",
  "Which sectors am I over-exposed to?",
];

export default function AiPage() {
  const [settings, setSettings] = useState<AiSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [analysisType, setAnalysisType] = useState("general");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ai.getSettings()
      .then(setSettings)
      .catch(() => setSettings(null))
      .finally(() => setLoadingSettings(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || sending) return;
    setInput("");
    setError("");

    const userMsg: ChatMessage = { role: "user", content: msg };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setSending(true);

    try {
      const { response } = await ai.analyze(msg, analysisType, messages);
      setMessages([...updated, { role: "assistant", content: response }]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setSending(false);
    }
  }

  if (loadingSettings) {
    return (
      <AppShell>
        <div className="flex justify-center items-center py-32">
          <Loader2 className="animate-spin text-blue-400" size={32} />
        </div>
      </AppShell>
    );
  }

  if (!settings?.hasApiKey) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto space-y-6 py-16">
          <div className="text-center">
            <Sparkles size={48} className="mx-auto mb-4 text-purple-400" />
            <h1 className="text-2xl font-bold">AI Portfolio Analysis</h1>
            <p className="text-gray-400 mt-2">
              Connect your Claude API key to get intelligent portfolio insights.
            </p>
          </div>
          <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold">How to get your Claude API key</h2>
            <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
              <li>Visit console.anthropic.com and sign in (free account available)</li>
              <li>Go to API Keys → Create new key</li>
              <li>Copy the key (starts with sk-ant-...)</li>
              <li>Paste it in Settings → AI Analysis</li>
            </ol>
            <a
              href="/settings"
              className="block text-center bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Go to Settings to add your key →
            </a>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles size={22} className="text-purple-400" /> AI Analysis
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Powered by Claude · {settings.apiKeyMasked}
            </p>
          </div>
          <select
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          >
            {ANALYSIS_TYPES.map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
          {messages.length === 0 && (
            <div className="space-y-3 pt-4">
              <p className="text-gray-500 text-sm text-center">Ask anything about your portfolio, or pick a starter:</p>
              <div className="grid gap-2">
                {STARTER_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSend(p)}
                    className="text-left bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-purple-500/40 rounded-xl px-4 py-3 text-sm text-gray-300 transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={16} className="text-purple-400" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-gray-900 text-gray-100 rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={16} className="text-blue-400" />
                </div>
              )}
            </div>
          ))}

          {sending && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-purple-400" />
              </div>
              <div className="bg-gray-900 rounded-2xl rounded-bl-sm px-4 py-3">
                <Loader2 size={16} className="animate-spin text-purple-400" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-xl px-4 py-3">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="flex-shrink-0 pt-4">
          <div className="flex gap-2 bg-gray-900 rounded-2xl p-3 border border-gray-800 focus-within:border-purple-500/50 transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about your portfolio… (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="flex-1 bg-transparent text-white text-sm resize-none focus:outline-none placeholder-gray-600 leading-6 min-h-[24px] max-h-32"
              style={{ overflowY: "auto" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || sending}
              className="flex-shrink-0 w-9 h-9 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
            >
              <Send size={15} />
            </button>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="text-xs text-gray-600 hover:text-gray-400 mt-2 ml-1 transition-colors"
            >
              Clear conversation
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
