"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Search, Star, TrendingDown, TrendingUp } from "lucide-react";
import AppShell from "@/components/AppShell";
import { auth, securities, type Quote } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

function fmtCurrency(n: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n || 0);
}

export default function SecuritiesPage() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [busySymbol, setBusySymbol] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<{ symbol: string; shortname?: string }[]>([]);
  const [watchlistQuotes, setWatchlistQuotes] = useState<Quote[]>([]);
  const [error, setError] = useState("");

  const watchlist = useMemo(() => user?.watchlist || [], [user?.watchlist]);

  async function loadWatchlistQuotes(symbols: string[]) {
    if (!symbols.length) {
      setWatchlistQuotes([]);
      return;
    }
    try {
      const res = await securities.quote(symbols);
      setWatchlistQuotes(Array.isArray(res.quotes) ? res.quotes : []);
    } catch {
      setWatchlistQuotes([]);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setError("");
    setLoading(true);
    try {
      const res = await securities.search(query.trim()) as { quotes?: { symbol: string; shortname?: string }[] };
      setSearchResults(res.quotes?.slice(0, 12) || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(symbol: string) {
    if (!user?.username) return;
    setBusySymbol(symbol);
    setError("");
    try {
      await auth.addToWatchlist({ username: user.username, symbol });
      await refresh();
      const updated = [...watchlist, symbol];
      await loadWatchlistQuotes(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add to watchlist");
    } finally {
      setBusySymbol(null);
    }
  }

  async function handleRemove(symbol: string) {
    if (!user?.username) return;
    setBusySymbol(symbol);
    setError("");
    try {
      await auth.removeFromWatchlist({ username: user.username, symbol });
      await refresh();
      const updated = watchlist.filter((s) => s !== symbol);
      await loadWatchlistQuotes(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to remove from watchlist");
    } finally {
      setBusySymbol(null);
    }
  }

  useEffect(() => {
    void loadWatchlistQuotes(watchlist);
  }, [watchlist]);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Securities</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Search symbols and manage your watchlist
          </p>
        </div>

        <section className="bg-gray-900 rounded-2xl p-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
              placeholder="Search ticker or company (e.g. RELIANCE, INFY)"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Search size={16} />}
            </button>
          </form>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((result) => {
                const watched = watchlist.includes(result.symbol);
                return (
                  <div key={result.symbol} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                    <div>
                      <p className="font-medium">{result.symbol}</p>
                      <p className="text-xs text-gray-400">{result.shortname || "Unknown name"}</p>
                    </div>
                    {watched ? (
                      <button
                        onClick={() => handleRemove(result.symbol)}
                        disabled={busySymbol === result.symbol}
                        className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAdd(result.symbol)}
                        disabled={busySymbol === result.symbol}
                        className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
                      >
                        Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>

        <section className="bg-gray-900 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
            <Star size={16} className="text-yellow-400" />
            <p className="font-medium">Your Watchlist</p>
          </div>
          {watchlist.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              Watchlist is empty. Search and add securities above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="text-left px-5 py-3">Symbol</th>
                    <th className="text-right px-5 py-3">Price</th>
                    <th className="text-right px-5 py-3">Change</th>
                    <th className="text-right px-5 py-3">Market Cap</th>
                    <th className="text-right px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((symbol) => {
                    const quote = watchlistQuotes.find((q) => q.symbol === symbol);
                    const change = quote?.regularMarketChangePercent || 0;
                    return (
                      <tr key={symbol} className="border-b border-gray-800/50 hover:bg-gray-800/40">
                        <td className="px-5 py-3 font-medium">{symbol}</td>
                        <td className="px-5 py-3 text-right">{fmtCurrency(quote?.regularMarketPrice || 0, quote?.currency || "INR")}</td>
                        <td className={`px-5 py-3 text-right ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
                          <span className="inline-flex items-center gap-1 justify-end">
                            {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {change.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-gray-300">
                          {quote?.marketCap ? quote.marketCap.toLocaleString("en-IN") : "-"}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => handleRemove(symbol)}
                            disabled={busySymbol === symbol}
                            className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
