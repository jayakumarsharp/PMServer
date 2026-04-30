"use client";
import { useState, useRef } from "react";
import AppShell from "@/components/AppShell";
import { imports } from "@/lib/api";
import { Upload, CheckCircle, AlertCircle, ArrowRight, RotateCcw } from "lucide-react";

type Step = "upload" | "mapping" | "preview" | "done";

interface PreviewResult {
  headers: string[];
  suggestedMapping: Record<string, string>;
  totalRows: number;
  toImportRows: number;
  duplicateRows: number;
  invalidRows: number;
  preview: { symbol: string; shares_owned: number; executed_price: number; tran_code: string }[];
  errors: { row: number; errors: string[] }[];
}

const PMS_FIELDS = [
  { key: "symbol",        label: "Symbol / Scrip" },
  { key: "shares_owned",  label: "Quantity" },
  { key: "executed_price",label: "Price" },
  { key: "tran_code",     label: "Buy / Sell" },
  { key: "createdAt",     label: "Date" },
  { key: "cost_basis",    label: "Total Amount (optional)" },
];

export default function ImportPage() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [portfolioId, setPortfolioId] = useState("");
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [result, setResult] = useState<{ importedRows: number; skippedRows: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = [".csv", ".xlsx", ".xls"];
  function isAccepted(name: string) {
    return ACCEPTED.some((ext) => name.toLowerCase().endsWith(ext));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && isAccepted(f.name)) setFile(f);
  }

  async function handlePreview() {
    if (!file || !portfolioId) return setError("Please select a file and enter a portfolio ID");
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("portfolioId", portfolioId);
      const res = await imports.preview(fd) as PreviewResult;
      setPreview(res);
      setMapping(res.suggestedMapping || {});
      setStep("mapping");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("portfolioId", portfolioId);
      fd.append("columnMap", JSON.stringify(mapping));
      const res = await imports.confirm(fd) as { importedRows: number; skippedRows: number };
      setResult(res);
      setStep("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep("upload"); setFile(null); setPreview(null);
    setResult(null); setMapping({}); setError("");
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Import Trades</h1>
          <p className="text-gray-400 text-sm mt-1">Upload a CSV or Excel file from any broker and map the columns to PMServer fields.</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 text-sm">
          {(["upload","mapping","preview","done"] as Step[]).map((s, i, arr) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ${step === s ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"}`}>
                {i + 1}
              </span>
              <span className={step === s ? "text-white" : "text-gray-500"}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
              {i < arr.length - 1 && <ArrowRight size={14} className="text-gray-700" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-700 text-red-300 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Step 1: Upload */}
        {step === "upload" && (
          <div className="space-y-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-2xl p-12 text-center cursor-pointer transition-colors"
            >
              <Upload size={40} className="mx-auto text-gray-500 mb-3" />
              {file ? (
                <p className="text-green-400 font-medium">{file.name}</p>
              ) : (
                <>
                  <p className="text-gray-300 font-medium">Drop your file here or click to browse</p>
                  <p className="text-gray-500 text-sm mt-1">CSV, XLSX, or XLS — Zerodha, Upstox, Groww, Angel</p>
                </>
              )}
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f && isAccepted(f.name)) setFile(f);
                }} />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Portfolio ID</label>
              <input
                value={portfolioId}
                onChange={(e) => setPortfolioId(e.target.value)}
                placeholder="Paste your portfolio _id from the dashboard"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handlePreview}
              disabled={!file || !portfolioId || loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-medium py-3 rounded-xl transition-colors"
            >
              {loading ? "Analysing…" : "Preview import"}
            </button>
          </div>
        )}

        {/* Step 2: Column mapping */}
        {step === "mapping" && preview && (
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
              <h2 className="font-semibold">Map columns</h2>
              <p className="text-sm text-gray-400">
                We auto-detected {Object.keys(preview.suggestedMapping).length} out of {PMS_FIELDS.length} fields.
                Adjust if needed.
              </p>

              {PMS_FIELDS.map((field) => (
                <div key={field.key} className="flex items-center gap-4">
                  <span className="w-40 text-sm text-gray-300 shrink-0">{field.label}</span>
                  <select
                    value={mapping[field.key] || ""}
                    onChange={(e) => setMapping({ ...mapping, [field.key]: e.target.value })}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">— skip —</option>
                    {preview.headers.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-sm transition-colors">
                Start over
              </button>
              <button onClick={() => setStep("preview")} className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-medium transition-colors">
                Preview rows ({preview.toImportRows})
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preview rows */}
        {step === "preview" && preview && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "To import", value: preview.toImportRows, color: "text-green-400" },
                { label: "Duplicates (skip)", value: preview.duplicateRows, color: "text-yellow-400" },
                { label: "Invalid (skip)", value: preview.invalidRows, color: "text-red-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-900 rounded-xl p-4 text-center">
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-xs text-gray-400 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Sample rows */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800 text-sm font-medium">
                Sample rows (first 20)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-800">
                      <th className="text-left px-4 py-2">Symbol</th>
                      <th className="text-right px-4 py-2">Qty</th>
                      <th className="text-right px-4 py-2">Price</th>
                      <th className="text-right px-4 py-2">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.preview.map((r, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="px-4 py-2 font-medium">{r.symbol}</td>
                        <td className="px-4 py-2 text-right">{r.shares_owned}</td>
                        <td className="px-4 py-2 text-right">{r.executed_price}</td>
                        <td className={`px-4 py-2 text-right font-medium ${r.tran_code === "by" ? "text-green-400" : "text-red-400"}`}>
                          {r.tran_code === "by" ? "Buy" : "Sell"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("mapping")} className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-sm transition-colors">
                Back to mapping
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || preview.toImportRows === 0}
                className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-40 py-3 rounded-xl text-sm font-medium transition-colors"
              >
                {loading ? "Importing…" : `Confirm import (${preview.toImportRows} trades)`}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {step === "done" && result && (
          <div className="bg-gray-900 rounded-2xl p-10 text-center space-y-4">
            <CheckCircle size={48} className="mx-auto text-green-400" />
            <h2 className="text-xl font-semibold">Import complete!</h2>
            <p className="text-gray-400">
              <span className="text-green-400 font-bold">{result.importedRows}</span> trades imported,{" "}
              <span className="text-yellow-400 font-bold">{result.skippedRows}</span> skipped.
            </p>
            <button onClick={reset} className="mt-4 flex items-center gap-2 mx-auto text-sm text-blue-400 hover:text-blue-300">
              <RotateCcw size={14} /> Import another file
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
