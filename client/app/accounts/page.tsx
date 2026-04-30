"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { accounts } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Plus, Landmark, RefreshCw } from "lucide-react";

interface Account {
  _id: string;
  name: string;
  currency: string;
  balance: number;
  value: number;
  platformId?: string;
  comment?: string;
  isExcluded?: boolean;
}

function fmt(n: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

export default function AccountsPage() {
  const { user } = useAuth();
  const [accountList, setAccountList] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", currency: "INR", balance: "", platformId: "", comment: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?._id) return;
    accounts.getByUser(user._id)
      .then((data) => setAccountList(data as Account[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!user?._id) return;
    setError("");
    setSaving(true);
    try {
      const acc = await accounts.create({ ...form, balance: parseFloat(form.balance) || 0, user_id: user._id });
      setAccountList((prev) => [...prev, acc as Account]);
      setShowAdd(false);
      setForm({ name: "", currency: "INR", balance: "", platformId: "", comment: "" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setSaving(false);
    }
  }

  const totalValue = accountList.filter((a) => !a.isExcluded).reduce((s, a) => s + (a.value || a.balance), 0);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Accounts</h1>
            <p className="text-gray-400 text-sm mt-0.5">Bank and brokerage accounts</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Plus size={16} /> Add account
          </button>
        </div>

        {/* Net cash card */}
        <div className="bg-gray-900 rounded-2xl p-6">
          <p className="text-sm text-gray-400">Total across accounts</p>
          <p className="text-3xl font-bold mt-1">{fmt(totalValue)}</p>
          <p className="text-xs text-gray-500 mt-1">Excluded accounts not counted</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <RefreshCw className="animate-spin text-blue-400" size={28} />
          </div>
        ) : accountList.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl p-10 text-center text-gray-500">
            <Landmark size={40} className="mx-auto mb-3 text-gray-700" />
            <p>No accounts yet. Add your bank or brokerage account.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {accountList.map((acc) => (
              <div key={acc._id} className={`bg-gray-900 rounded-2xl p-5 flex items-center justify-between ${acc.isExcluded ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <Landmark size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">{acc.name}</p>
                    <p className="text-sm text-gray-400">{acc.platformId || acc.currency}</p>
                    {acc.comment && <p className="text-xs text-gray-500">{acc.comment}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{fmt(acc.value || acc.balance, acc.currency)}</p>
                  {acc.isExcluded && <p className="text-xs text-yellow-500 mt-0.5">Excluded</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add account modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreate} className="bg-gray-900 rounded-2xl p-8 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Add Account</h3>
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div>
              <label className="block text-sm text-gray-400 mb-1">Account Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. HDFC Savings"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Currency</label>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500">
                  {["INR","USD","EUR","GBP","AUD"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Balance</label>
                <input type="number" value={form.balance} onChange={(e) => setForm({ ...form, balance: e.target.value })}
                  placeholder="0"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Platform / Broker</label>
              <input value={form.platformId} onChange={(e) => setForm({ ...form, platformId: e.target.value })}
                placeholder="e.g. Zerodha, HDFC"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
              <input value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAdd(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 py-2.5 rounded-lg text-sm transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 py-2.5 rounded-lg text-sm font-medium transition-colors">
                {saving ? "Saving…" : "Add account"}
              </button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
