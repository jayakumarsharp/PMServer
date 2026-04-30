"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import { portfolios, transactions, securities } from "@/lib/api";
import { TrendingUp, TrendingDown, Plus, RefreshCw } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { Portfolio, Holding } from "@/lib/api";

const COLORS = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#ec4899","#84cc16"];

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

export default function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ symbol: "", shares_owned: "", executed_price: "", tran_code: "by" });
  const [addError, setAddError] = useState("");
  const [searchResults, setSearchResults] = useState<{ symbol: string; shortname: string }[]>([]);

  useEffect(() => {
    if (!id) return;
    portfolios.get(id).then((data) => {
      const d = data as { existingPortfolio: Portfolio };
      setPortfolio(d.existingPortfolio);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  async function handleSymbolSearch(q: string) {
    if (q.length < 2) return;
    try {
      const res = await securities.search(q) as { quotes?: { symbol: string; shortname: string }[] };
      setSearchResults(res.quotes?.slice(0, 6) || []);
    } catch {}
  }

  async function handleAddTransaction(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    try {
      await transactions.create({
        ...addForm,
        shares_owned: parseFloat(addForm.shares_owned),
        executed_price: parseFloat(addForm.executed_price),
        portfolio_id: id,
      });
      setShowAdd(false);
      setAddForm({ symbol: "", shares_owned: "", executed_price: "", tran_code: "by" });
      window.location.reload();
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : "Failed to add");
    }
  }

  const holdings: Holding[] = portfolio?.holdings || [];
  const totalInvested = holdings.reduce((s, h) => s + h.total_invested, 0);
  const todayValue    = holdings.reduce((s, h) => s + h.today_value, 0);
  const totalGain     = todayValue - totalInvested;
  const pieData       = holdings.map((h) => ({ name: h.symbol, value: h.today_value }));

  if (loading) {
    return <AppShell><div className="flex justify-center pt-20"><RefreshCw className="animate-spin text-blue-400" size={32} /></div></AppShell>;
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{portfolio?.name || id}</h1>
            <p className="text-gray-400 text-sm">{holdings.length} holdings</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> Add position
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Today's Value", val: fmt(todayValue) },
            { label: "Total Invested", val: fmt(totalInvested) },
            { label: "Total P&L", val: fmt(totalGain), colored: true },
          ].map(({ label, val, colored }) => (
            <div key={label} className="bg-gray-900 rounded-2xl p-5">
              <p className="text-sm text-gray-400">{label}</p>
              <p className={`text-2xl font-bold mt-1 ${colored ? (totalGain >= 0 ? "text-green-400" : "text-red-400") : ""}`}>
                {val}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Holdings table */}
          <div className="lg:col-span-2 bg-gray-900 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 font-medium">Holdings</div>
            {holdings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No holdings yet. Add a position above.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-800">
                      <th className="text-left px-5 py-3">Symbol</th>
                      <th className="text-right px-5 py-3">Qty</th>
                      <th className="text-right px-5 py-3">Avg</th>
                      <th className="text-right px-5 py-3">LTP</th>
                      <th className="text-right px-5 py-3">P&amp;L %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((h, i) => (
                      <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/40">
                        <td className="px-5 py-3 font-medium">{h.symbol}</td>
                        <td className="px-5 py-3 text-right text-gray-300">{h.quantity}</td>
                        <td className="px-5 py-3 text-right text-gray-300">{fmt(h.average_buy_price)}</td>
                        <td className="px-5 py-3 text-right">{fmt(h.regular_market_price)}</td>
                        <td className={`px-5 py-3 text-right font-semibold flex items-center justify-end gap-1 ${h.gain_loss_percent >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {h.gain_loss_percent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {h.gain_loss_percent.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Allocation pie chart */}
          {pieData.length > 0 && (
            <div className="bg-gray-900 rounded-2xl p-5">
              <p className="font-medium mb-4">Allocation</p>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={false}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(Number(v))} contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Add position modal */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <form onSubmit={handleAddTransaction} className="bg-gray-900 rounded-2xl p-8 w-full max-w-md space-y-4 shadow-2xl">
              <h3 className="text-lg font-semibold">Add Position</h3>

              {addError && <p className="text-red-400 text-sm">{addError}</p>}

              <div>
                <label className="block text-sm text-gray-400 mb-1">Symbol</label>
                <input
                  value={addForm.symbol}
                  onChange={(e) => { setAddForm({ ...addForm, symbol: e.target.value }); handleSymbolSearch(e.target.value); }}
                  placeholder="e.g. RELIANCE.NS"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  required
                />
                {searchResults.length > 0 && (
                  <div className="bg-gray-800 border border-gray-700 rounded-lg mt-1 overflow-hidden">
                    {searchResults.map((s) => (
                      <button key={s.symbol} type="button"
                        onClick={() => { setAddForm({ ...addForm, symbol: s.symbol }); setSearchResults([]); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700">
                        <span className="font-medium">{s.symbol}</span>
                        <span className="text-gray-400 ml-2">{s.shortname}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Quantity</label>
                  <input type="number" min="0.001" step="any" value={addForm.shares_owned}
                    onChange={(e) => setAddForm({ ...addForm, shares_owned: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Price</label>
                  <input type="number" min="0.01" step="any" value={addForm.executed_price}
                    onChange={(e) => setAddForm({ ...addForm, executed_price: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" required />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Type</label>
                <select value={addForm.tran_code} onChange={(e) => setAddForm({ ...addForm, tran_code: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500">
                  <option value="by">Buy</option>
                  <option value="sl">Sell</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Add
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
