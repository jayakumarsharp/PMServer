"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { brokers, ai, AiSettings } from "@/lib/api";
import { CheckCircle, Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";

const SUPPORTED = [
  { key: "upstox", name: "Upstox", free: true },
  { key: "fyers",  name: "Fyers",  free: true },
  { key: "zerodha",name: "Zerodha",free: false, note: "₹2000/mo developer fee" },
];

export default function SettingsPage() {
  // Broker state
  const [connecting, setConnecting] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [connected, setConnected] = useState<string[]>([]);
  const [brokerError, setBrokerError] = useState("");

  // Claude AI state
  const [aiSettings, setAiSettings] = useState<AiSettings | null>(null);
  const [claudeKey, setClaudeKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  const [keyError, setKeyError] = useState("");
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    ai.getSettings().then(setAiSettings).catch(() => {});
  }, []);

  async function handleConnect(broker: string) {
    if (!apiKey) return setBrokerError("API key is required");
    setBrokerError("");
    try {
      await brokers.connect(broker, apiKey, apiSecret);
      setConnected((prev) => [...prev, broker]);
      setConnecting(null);
      setApiKey(""); setApiSecret("");
    } catch (err: unknown) {
      setBrokerError(err instanceof Error ? err.message : "Connection failed");
    }
  }

  async function handleSaveClaudeKey() {
    if (!claudeKey.trim()) return setKeyError("Enter a Claude API key");
    setKeyError("");
    setSavingKey(true);
    setKeySaved(false);
    try {
      await ai.saveSettings({ claudeApiKey: claudeKey.trim() });
      const updated = await ai.getSettings();
      setAiSettings(updated);
      setClaudeKey("");
      setKeySaved(true);
    } catch (err: unknown) {
      setKeyError(err instanceof Error ? err.message : "Failed to save key");
    } finally {
      setSavingKey(false);
    }
  }

  async function handleRemoveClaudeKey() {
    setSavingKey(true);
    try {
      await ai.saveSettings({ claudeApiKey: "" });
      setAiSettings((prev) => prev ? { ...prev, hasApiKey: false, apiKeyMasked: null, aiAnalysisEnabled: false } : prev);
      setKeySaved(false);
    } finally {
      setSavingKey(false);
    }
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-400 text-sm mt-0.5">Broker connections and preferences</p>
        </div>

        {/* ── Claude AI section ────────────────────────────────────────────── */}
        <section className="bg-gray-900 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-purple-400" />
            <h2 className="font-semibold">AI Analysis (Claude)</h2>
          </div>
          <p className="text-sm text-gray-400">
            Connect your personal Claude API key to enable intelligent portfolio analysis.
            Your key is stored securely on your server and never shared.
          </p>

          {aiSettings === null ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Loader2 size={14} className="animate-spin" /> Loading…
            </div>
          ) : aiSettings.hasApiKey ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3">
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-400">AI Analysis enabled</p>
                  <p className="text-xs text-gray-500 truncate">{aiSettings.apiKeyMasked}</p>
                </div>
                <button
                  onClick={handleRemoveClaudeKey}
                  disabled={savingKey}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
              <p className="text-xs text-gray-500">
                To update your key, remove the existing one and add a new key.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {keyError && <p className="text-red-400 text-sm">{keyError}</p>}
              {keySaved && <p className="text-green-400 text-sm flex items-center gap-1"><CheckCircle size={14} /> Key saved successfully!</p>}

              <div className="relative">
                <input
                  value={claudeKey}
                  onChange={(e) => setClaudeKey(e.target.value)}
                  type={showKey ? "text" : "password"}
                  placeholder="sk-ant-api03-..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-white text-sm focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Get your key at{" "}
                <span className="text-purple-400">console.anthropic.com</span>
                {" "}→ API Keys. Free tier available.
              </p>

              <button
                onClick={handleSaveClaudeKey}
                disabled={savingKey || !claudeKey.trim()}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                {savingKey ? "Saving…" : "Save API key"}
              </button>
            </div>
          )}
        </section>

        {/* ── Broker connections ───────────────────────────────────────────── */}
        <section className="bg-gray-900 rounded-2xl p-6 space-y-5">
          <h2 className="font-semibold">Broker Connections</h2>
          <p className="text-sm text-gray-400">
            Connect your broker account to auto-sync positions. Your API keys are stored securely on your server.
          </p>

          {brokerError && <p className="text-red-400 text-sm">{brokerError}</p>}

          <div className="space-y-3">
            {SUPPORTED.map((b) => (
              <div key={b.key} className="flex items-center justify-between bg-gray-800 rounded-xl px-5 py-4">
                <div>
                  <p className="font-medium">{b.name}</p>
                  <p className="text-xs text-gray-400">{b.free ? "Free API" : b.note}</p>
                </div>
                {connected.includes(b.key) ? (
                  <span className="flex items-center gap-1 text-green-400 text-sm"><CheckCircle size={14} /> Connected</span>
                ) : (
                  <button
                    onClick={() => setConnecting(connecting === b.key ? null : b.key)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>

          {connecting && (
            <div className="bg-gray-800 rounded-xl p-5 space-y-3">
              <p className="text-sm font-medium capitalize">Enter {connecting} API credentials</p>
              <input value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                placeholder="API Key"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
              <input value={apiSecret} onChange={(e) => setApiSecret(e.target.value)}
                placeholder="API Secret (optional)"
                type="password"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
              <div className="flex gap-2">
                <button onClick={() => setConnecting(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg text-sm">
                  Cancel
                </button>
                <button onClick={() => handleConnect(connecting)} className="flex-1 bg-blue-600 hover:bg-blue-500 py-2.5 rounded-lg text-sm font-medium">
                  Save
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── Support ──────────────────────────────────────────────────────── */}
        <section className="bg-gray-900 rounded-2xl p-6 space-y-3">
          <h2 className="font-semibold">Support PMServer</h2>
          <p className="text-sm text-gray-400">
            This tool is free and open source forever. If it saves you time, consider supporting development.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/sponsors" target="_blank" rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2.5 rounded-lg transition-colors">
              GitHub Sponsors
            </a>
            <a href="https://buymeacoffee.com" target="_blank" rel="noopener noreferrer"
              className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 text-sm px-4 py-2.5 rounded-lg transition-colors">
              Buy me a coffee
            </a>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
