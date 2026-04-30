"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, Briefcase, Upload, Mic, Landmark, Settings,
  LogOut, TrendingUp, Menu, X, Sparkles,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard" },
  { href: "/portfolio",  icon: Briefcase,        label: "Portfolios" },
  { href: "/securities", icon: TrendingUp,       label: "Markets" },
  { href: "/import",     icon: Upload,           label: "Import" },
  { href: "/voice",      icon: Mic,              label: "Voice Entry" },
  { href: "/ai",         icon: Sparkles,         label: "AI Analysis" },
  { href: "/accounts",   icon: Landmark,         label: "Accounts" },
  { href: "/settings",   icon: Settings,         label: "Settings" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const Sidebar = () => (
    <aside className="flex flex-col w-60 bg-gray-900 border-r border-gray-800 h-full">
      <div className="px-6 py-5 border-b border-gray-800">
        <span className="text-lg font-bold text-white">PMServer</span>
        <p className="text-xs text-gray-500 mt-0.5">{user?.username}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600/20 text-blue-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-60 flex-shrink-0">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <span className="font-bold text-white">PMServer</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400">
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
