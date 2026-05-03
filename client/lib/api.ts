const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3003";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("pms_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    localStorage.removeItem("pms_token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
  login: (username: string, password: string) =>
    request<{ token: string }>("/api/users/token", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  register: (username: string, email: string, password: string) =>
    request<{ username: string; email: string }>("/api/users/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    }),
  getUser: (username: string) => request<{ user: User }>(`/api/users/${username}/complete`),
  addToWatchlist: (data: { username: string; symbol: string }) =>
    request<{ watched: { watchlist: string } }>("/api/users/watchlist", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  removeFromWatchlist: (data: { username: string; symbol: string }) =>
    request<{ unwatched: { watchlist: string } }>("/api/users/removeWatchlist", {
      method: "DELETE",
      body: JSON.stringify(data),
    }),
};

// ── Portfolio ─────────────────────────────────────────────────────────────────
export const portfolios = {
  create: (data: { name: string; notes?: string; user_id: string }) =>
    request("/api/portfolio/createPortfolio", { method: "POST", body: JSON.stringify(data) }),
  get: (name: string) => request(`/api/portfolio/${name}`),
  update: (id: string, data: object) =>
    request(`/api/portfolio/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: string) => request(`/api/portfolio/${id}`, { method: "DELETE" }),
};

// ── Transactions ──────────────────────────────────────────────────────────────
export const transactions = {
  create: (data: object) =>
    request("/api/portfoliotransactions/createTransaction", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Securities ────────────────────────────────────────────────────────────────
export const securities = {
  search: (name: string) =>
    request("/api/security/search", { method: "POST", body: JSON.stringify({ name }) }),
  quote: (symbols: string[]) =>
    request<{ quotes: Quote[] }>("/api/security/quote", {
      method: "POST",
      body: JSON.stringify({ symbols }),
    }),
  history: (symbol: string, fromDate: string, toDate: string) =>
    request("/api/heatmap/getpricehistoryforsecurity", {
      method: "POST",
      body: JSON.stringify({ symbol, fromDate, toDate }),
    }),
};

// ── Price ─────────────────────────────────────────────────────────────────────
export const prices = {
  get: (symbol: string) => request(`/api/price/getPrice/${symbol}`),
};

// ── Accounts ──────────────────────────────────────────────────────────────────
export const accounts = {
  getByUser: (userId: string) => request(`/api/account/accounts/${userId}`),
  create: (data: object) =>
    request("/api/account/accounts", { method: "POST", body: JSON.stringify(data) }),
  update: (data: object) =>
    request("/api/account/updateaccount", { method: "POST", body: JSON.stringify(data) }),
};

// ── Import ────────────────────────────────────────────────────────────────────
export const imports = {
  templates: () => request("/api/import/templates"),
  getMappings: () => request("/api/import/mappings"),
  saveMapping: (data: object) =>
    request("/api/import/mappings", { method: "POST", body: JSON.stringify(data) }),
  preview: (formData: FormData) =>
    fetch(`${BASE}/api/import/preview`, {
      method: "POST",
      credentials: "include",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then((r) => r.json()),
  confirm: (formData: FormData) =>
    fetch(`${BASE}/api/import/confirm`, {
      method: "POST",
      credentials: "include",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then((r) => r.json()),
};

// ── Voice ─────────────────────────────────────────────────────────────────────
export const voice = {
  parse: (text: string) =>
    request<VoiceResult>("/api/voice/parse", { method: "POST", body: JSON.stringify({ text }) }),
};

// ── Broker ────────────────────────────────────────────────────────────────────
export const brokers = {
  supported: () => request("/api/broker/supported"),
  status: () => request("/api/broker/status"),
  connect: (broker: string, apiKey: string, apiSecret?: string) =>
    request("/api/broker/connect", {
      method: "POST",
      body: JSON.stringify({ broker, apiKey, apiSecret }),
    }),
  sync: (broker: string, portfolioId: string) =>
    request(`/api/broker/${broker}/sync`, {
      method: "POST",
      body: JSON.stringify({ portfolioId }),
    }),
};

// ── AI (Claude) ───────────────────────────────────────────────────────────────
export const ai = {
  getSettings: () =>
    request<AiSettings>("/api/ai/settings"),
  saveSettings: (data: { claudeApiKey?: string; defaultCurrency?: string }) =>
    request("/api/ai/settings", { method: "POST", body: JSON.stringify(data) }),
  analyze: (message: string, analysisType = "general", chatHistory: ChatMessage[] = []) =>
    request<{ response: string }>("/api/ai/analyze", {
      method: "POST",
      body: JSON.stringify({ message, analysisType, chatHistory }),
    }),
};

// ── Health ────────────────────────────────────────────────────────────────────
export const health = () => request<{ status: string }>("/health");

// ── Types ─────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  username: string;
  email: string;
  watchlist: string[];
  portfolios?: Portfolio[];
}

export interface Portfolio {
  _id: string;
  name: string;
  notes?: string;
  user_id: string;
  holdings?: Holding[];
}

export interface Holding {
  portfolioid: string;
  secid: string;
  symbol: string;
  quantity: number;
  executed_price: number;
  regular_market_price: number;
  total_invested: number;
  today_value: number;
  gain_loss_percent: number;
  average_buy_price: number;
}

export interface Quote {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChangePercent: number;
  marketCap: number;
  currency: string;
}

export interface AiSettings {
  hasApiKey: boolean;
  apiKeyMasked: string | null;
  aiAnalysisEnabled: boolean;
  defaultCurrency: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface VoiceResult {
  raw: string;
  action: "by" | "sl" | null;
  quantity: number | null;
  price: number | null;
  symbol: string;
  symbolResolved: boolean;
  symbolName: string | null;
  confidence: number;
  ready: boolean;
  warnings: string[];
}
