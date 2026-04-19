import axios from "axios";
import { BrokerAdapter } from "./BrokerAdapter";

const BASE = "https://api-t1.fyers.in/api/v3";

/**
 * Fyers Adapter — uses the free Fyers API v3.
 * Docs: https://myapi.fyers.in/docs/
 */
export class FyersAdapter extends BrokerAdapter {
  get name() { return "Fyers"; }

  getAuthUrl() {
    const appId = this.credentials.apiKey;
    const redirectUri = encodeURIComponent(this.credentials.redirectUri || "http://localhost:3003/api/broker/callback/fyers");
    return `https://api-t1.fyers.in/api/v3/generate-authcode?client_id=${appId}&redirect_uri=${redirectUri}&response_type=code&state=fyers`;
  }

  async exchangeCode(code) {
    const resp = await axios.post(`${BASE}/validate-authcode`, {
      grant_type: "authorization_code",
      appIdHash: this.credentials.appIdHash, // SHA256 of appId:secretId
      code,
    });
    return {
      accessToken: resp.data.access_token,
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }

  _headers() {
    return {
      Authorization: `${this.credentials.apiKey}:${this.credentials.accessToken}`,
    };
  }

  async getPositions() {
    const resp = await axios.get(`${BASE}/holdings`, { headers: this._headers() });
    const data = resp.data?.holdings || [];
    return data.map((p) => ({
      symbol: p.symbol,
      shares_owned: p.holdingType === "HLD" ? p.totalQty : p.remainingQuantity,
      avg_price: p.costPrice,
      current_value: p.ltp * p.totalQty,
      pnl: p.pl,
    }));
  }

  async getTrades() {
    const resp = await axios.get(`${BASE}/tradebook`, { headers: this._headers() });
    const data = resp.data?.tradeBook || [];
    return data.map((t) => ({
      symbol: t.symbol,
      qty: t.tradedQty,
      price: t.tradePrice,
      type: t.side === 1 ? "by" : "sl",
      date: t.orderDateTime,
    }));
  }

  async getMargins() {
    const resp = await axios.get(`${BASE}/funds`, { headers: this._headers() });
    const fund = resp.data?.fund_limit?.[0] || {};
    return {
      total: fund.equityAmount || 0,
      available: fund.availableBalance || 0,
      used: (fund.equityAmount || 0) - (fund.availableBalance || 0),
    };
  }
}
