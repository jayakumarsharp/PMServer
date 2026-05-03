"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Plus, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import AppShell from "@/components/AppShell";
import { portfolios } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Holding, Portfolio } from "@/lib/api";

interface PortfolioWithStats extends Portfolio {
  totalInvested: number;
  todayValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

function fmt(n: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

function withStats(p: Portfolio): PortfolioWithStats {
  const holdings: Holding[] = p.holdings || [];
  const totalInvested = holdings.reduce((sum, h) => sum + h.total_invested, 0);
  const todayValue = holdings.reduce((sum, h) => sum + h.today_value, 0);
  const gainLoss = todayValue - totalInvested;
  const gainLossPercent = totalInvested ? (gainLoss / totalInvested) * 100 : 0;
  return { ...p, totalInvested, todayValue, gainLoss, gainLossPercent };
}

export default function PortfoliosPage() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", notes: "" });

  const portfolioList = useMemo(
    () => (user?.portfolios || []).map(withStats),
    [user?.portfolios]
  );

  async function handleCreatePortfolio(e: React.FormEvent) {
    e.preventDefault();
    if (!user?._id) return;
    setSaving(true);
    setError("");
    try {
      await portfolios.create({
        name: form.name.trim(),
        notes: form.notes.trim(),
        user_id: user._id,
      });
      await refresh();
      setShowCreate(false);
      setForm({ name: "", notes: "" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create portfolio");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Portfolios</h1>
            <p className="text-gray-400 text-sm mt-0.5">Create and monitor your investment buckets</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> New portfolio
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <RefreshCw className="animate-spin text-blue-400" size={30} />
          </div>
        ) : portfolioList.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl p-10 text-center text-gray-500">
            <Briefcase size={42} className="mx-auto mb-3 text-gray-700" />
            <p>No portfolios yet.</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-3 text-blue-400 hover:text-blue-300 text-sm"
            >
              Create your first portfolio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {portfolioList.map((p) => (
              <Link
                key={p._id}
                href={`/portfolio/${p._id}`}
                className="bg-gray-900 rounded-2xl p-5 hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {p.holdings?.length || 0} holding{p.holdings?.length !== 1 ? "s" : ""}
                    </p>
                    {p.notes ? <p className="text-xs text-gray-500 mt-2 line-clamp-2">{p.notes}</p> : null}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{fmt(p.todayValue)}</p>
                    <p className={`mt-1 text-sm flex items-center justify-end gap-1 ${p.gainLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {p.gainLoss >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {p.gainLossPercent >= 0 ? "+" : ""}
                      {p.gainLossPercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreatePortfolio} className="w-full max-w-md bg-gray-900 rounded-2xl p-7 space-y-4">
            <h3 className="text-lg font-semibold">Create Portfolio</h3>
            {error ? <p className="text-red-400 text-sm">{error}</p> : null}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                placeholder="e.g. Core Long-Term"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                rows={3}
                placeholder="Optional notes"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-lg py-2.5 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg py-2.5 text-sm font-medium transition-colors"
              >
                {saving ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
