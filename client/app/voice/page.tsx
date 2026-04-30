"use client";
import { useState, useRef, useCallback } from "react";
import AppShell from "@/components/AppShell";
import { voice, transactions } from "@/lib/api";
import { Mic, MicOff, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import type { VoiceResult } from "@/lib/api";

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export default function VoicePage() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<VoiceResult | null>(null);
  const [portfolioId, setPortfolioId] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return setError("Voice recognition is not supported in this browser. Use Chrome or Edge.");

    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      const text = Array.from(event.results)
        .map((r: SpeechRecognitionResult) => r[0].transcript)
        .join(" ");
      setTranscript(text);
    };

    rec.onend = () => setListening(false);
    rec.onerror = (e: SpeechRecognitionErrorEvent) => { setError(`Speech error: ${e.error}`); setListening(false); };

    rec.start();
    recognitionRef.current = rec;
    setListening(true);
    setResult(null);
    setSaved(false);
    setError("");
  }, []);

  function stopListening() {
    recognitionRef.current?.stop();
    setListening(false);
  }

  async function handleParse() {
    if (!transcript.trim()) return;
    setLoading(true);
    setError("");
    try {
      const r = await voice.parse(transcript) as VoiceResult;
      setResult(r);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Parse failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result?.ready || !portfolioId) return setError("Portfolio ID is required");
    setLoading(true);
    try {
      await transactions.create({
        symbol: result.symbol,
        shares_owned: result.quantity,
        executed_price: result.price || 0,
        tran_code: result.action,
        portfolio_id: portfolioId,
        createdBy: "voice",
      });
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  const confidenceColor = (c: number) =>
    c >= 80 ? "text-green-400" : c >= 50 ? "text-yellow-400" : "text-red-400";

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Voice Position Entry</h1>
          <p className="text-gray-400 text-sm mt-1">
            Say something like <em className="text-blue-300">"buy 50 Reliance at 2850"</em> or <em className="text-blue-300">"sell 100 TCS"</em>
          </p>
        </div>

        {/* Mic button */}
        <div className="flex flex-col items-center gap-6 py-6">
          <button
            onClick={listening ? stopListening : startListening}
            className={`w-28 h-28 rounded-full flex items-center justify-center shadow-lg transition-all ${
              listening
                ? "bg-red-600 hover:bg-red-500 animate-pulse"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {listening ? <MicOff size={44} /> : <Mic size={44} />}
          </button>
          <p className="text-sm text-gray-400">
            {listening ? "Listening… tap to stop" : "Tap to speak"}
          </p>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-gray-900 rounded-2xl p-5 space-y-3">
            <p className="text-sm text-gray-400">Transcript</p>
            <p className="text-lg font-medium italic text-white">"{transcript}"</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setTranscript(""); setResult(null); }}
                className="text-sm text-gray-400 hover:text-white"
              >
                Clear
              </button>
              <button
                onClick={handleParse}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : null}
                Parse command
              </button>
            </div>
          </div>
        )}

        {/* Manual text input fallback */}
        <div className="bg-gray-900 rounded-2xl p-5">
          <p className="text-sm text-gray-400 mb-2">Or type a command</p>
          <div className="flex gap-2">
            <input
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="buy 50 Infosys at 1800"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
            />
            <button
              onClick={handleParse}
              disabled={loading || !transcript}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
            >
              Parse
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm flex gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
          </div>
        )}

        {/* Parsed result */}
        {result && (
          <div className="bg-gray-900 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Parsed Command</h3>
              <span className={`text-sm font-bold ${confidenceColor(result.confidence)}`}>
                {result.confidence}% confident
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Action", value: result.action === "by" ? "BUY" : result.action === "sl" ? "SELL" : "—", colored: true },
                { label: "Symbol", value: result.symbol || "—" },
                { label: "Company", value: result.symbolName || "Not resolved" },
                { label: "Quantity", value: result.quantity?.toString() || "—" },
                { label: "Price", value: result.price ? `₹${result.price}` : "Market price" },
              ].map(({ label, value, colored }) => (
                <div key={label} className="bg-gray-800 rounded-xl p-3">
                  <p className="text-gray-400 text-xs">{label}</p>
                  <p className={`font-semibold mt-0.5 ${colored ? (result.action === "by" ? "text-green-400" : "text-red-400") : "text-white"}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {result.warnings.length > 0 && (
              <div className="text-sm text-yellow-400 space-y-1">
                {result.warnings.map((w, i) => <p key={i}>⚠ {w}</p>)}
              </div>
            )}

            {result.ready && !saved && (
              <div className="space-y-3 pt-2 border-t border-gray-800">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Portfolio ID</label>
                  <input
                    value={portfolioId}
                    onChange={(e) => setPortfolioId(e.target.value)}
                    placeholder="Paste portfolio _id"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={loading || !portfolioId}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  {loading ? "Saving…" : "Confirm & save position"}
                </button>
              </div>
            )}

            {saved && (
              <div className="flex items-center gap-2 text-green-400 justify-center py-2">
                <CheckCircle size={20} /> Position saved!
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
