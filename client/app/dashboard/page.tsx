"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import AppShell from "@/components/AppShell";
import { TrendingUp, TrendingDown, Briefcase, DollarSign, RefreshCw } from "lucide-react";
import type { Portfolio, Holding } from "@/lib/api";

interface PortfolioWithStats extends Portfolio {
  totalInvested: number;
  todayValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

function computeStats(p: Portfolio): PortfolioWithStats {
  const holdings: Holding[] = p.holdings || [];
  const totalInvested = holdings.reduce((s, h) => s + h.total_invested, 0);
  const todayValue    = holdings.reduce((s, h) => s + h.today_value, 0);
  const gainLoss      = todayValue - totalInvested;
  const gainLossPercent = totalInvested ? (gainLoss / totalInvested) * 100 : 0;
  return { ...p, totalInvested, todayValue, gainLoss, gainLossPercent };
}

function StatCard({ label, value, sub, positive }: { label: string; value: string; sub?: string; positive?: boolean }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-5">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sub && (
        <p className={`text-sm mt-1 flex items-center gap-1 ${positive ? "text-green-400" : "text-red-400"}`}>
          {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {sub}
        </p>
      )}
    </div>
  );
}

function fmt(n: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<PortfolioWithStats[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.portfolios) {
      setPortfolios(user.portfolios.map(computeStats));
    }
  }, [user]);

  async function handleRefresh() {
    setRefreshing(true);
    // Reload user data with fresh prices
    window.location.reload();
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin text-blue-400" size={32} />
        </div>
      </AppShell>
    );
  }

  const netWorth     = portfolios.reduce((s, p) => s + p.todayValue, 0);
  const totalInvested = portfolios.reduce((s, p) => s + p.totalInvested, 0);
  const totalGain     = netWorth - totalInvested;
  const totalGainPct  = totalInvested ? (totalGain / totalInvested) * 100 : 0;

  const topHoldings = portfolios
    .flatMap((p) => p.holdings || [])
    .sort((a, b) => b.today_value - a.today_value)
    .slice(0, 5);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.username}</h1>
            <p className="text-gray-400 text-sm mt-0.5">Portfolio overview</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Net worth cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Portfolio Value" value={fmt(netWorth)} />
          <StatCard label="Total Invested"  value={fmt(totalInvested)} />
          <StatCard
            label="Overall Gain / Loss"
            value={fmt(totalGain)}
            sub={`${totalGainPct >= 0 ? "+" : ""}${totalGainPct.toFixed(2)}%`}
            positive={totalGain >= 0}
          />
        </div>

        {/* Portfolios */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Briefcase size={18} className="text-blue-400" /> Portfolios
            </h2>
            <Link href="/portfolio" className="text-sm text-blue-400 hover:text-blue-300">
              + New portfolio
            </Link>
          </div>

          {portfolios.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl p-8 text-center text-gray-500">
              <p>No portfolios yet.</p>
              <Link href="/portfolio" className="mt-2 inline-block text-blue-400 text-sm hover:underline">
                Create your first portfolio →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {portfolios.map((p) => (
                <Link
                  key={p._id}
                  href={`/portfolio/${p._id}`}
                  className="block bg-gray-900 rounded-2xl p-5 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {p.holdings?.length || 0} holding{p.holdings?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{fmt(p.todayValue)}</p>
                      <p className={`text-sm mt-0.5 ${p.gainLoss >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {p.gainLoss >= 0 ? "+" : ""}{p.gainLossPercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Top holdings */}
        {topHoldings.length > 0 && (
          <section>
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <DollarSign size={18} className="text-green-400" /> Top Holdings
            </h2>
            <div className="bg-gray-900 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400">
                    <th className="text-left px-5 py-3">Symbol</th>
                    <th className="text-right px-5 py-3">Qty</th>
                    <th className="text-right px-5 py-3">Avg Price</th>
                    <th className="text-right px-5 py-3">LTP</th>
                    <th className="text-right px-5 py-3">Value</th>
                    <th className="text-right px-5 py-3">P&amp;L %</th>
                  </tr>
                </thead>
                <tbody>
                  {topHoldings.map((h, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                      <td className="px-5 py-3 font-medium">{h.symbol}</td>
                      <td className="px-5 py-3 text-right text-gray-300">{h.quantity}</td>
                      <td className="px-5 py-3 text-right text-gray-300">{fmt(h.average_buy_price)}</td>
                      <td className="px-5 py-3 text-right text-gray-300">{fmt(h.regular_market_price)}</td>
                      <td className="px-5 py-3 text-right font-medium">{fmt(h.today_value)}</td>
                      <td className={`px-5 py-3 text-right font-medium ${h.gain_loss_percent >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {h.gain_loss_percent >= 0 ? "+" : ""}{h.gain_loss_percent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
