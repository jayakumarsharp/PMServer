import axios from "axios";
import { BrokerAdapter } from "./BrokerAdapter";

const BASE = "https://api.upstox.com/v2";

/**
 * Upstox Adapter — uses the free Upstox Developer API v2.
 * Docs: https://upstox.com/developer/api-documentation/
 *
 * Setup:
 *   1. Create app at https://developer.upstox.com/
 *   2. Get apiKey and apiSecret
 *   3. User visits getAuthUrl() → authorises → you get a code
 *   4. Call exchangeCode(code) to get accessToken
 */
export class UpstoxAdapter extends BrokerAdapter {
  get name() { return "Upstox"; }

  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: this.credentials.apiKey,
      redirect_uri: this.credentials.redirectUri || "http://localhost:3003/api/broker/callback/upstox",
      response_type: "code",
    });
    return `https://api.upstox.com/v2/login/authorization/dialog?${params}`;
  }

  async exchangeCode(code) {
    const resp = await axios.post(`${BASE}/login/authorization/token`, {
      code,
      client_id: this.credentials.apiKey,
      client_secret: this.credentials.apiSecret,
      redirect_uri: this.credentials.redirectUri,
      grant_type: "authorization_code",
    }, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });

    return {
      accessToken: resp.data.access_token,
      refreshToken: resp.data.refresh_token,
      expiry: new Date(Date.now() + (resp.data.expires_in || 86400) * 1000),
    };
  }

  _headers() {
    return {
      Authorization: `Bearer ${this.credentials.accessToken}`,
      Accept: "application/json",
    };
  }

  async getPositions() {
    const resp = await axios.get(`${BASE}/portfolio/long-term-holdings`, { headers: this._headers() });
    const data = resp.data?.data || [];
    return data.map((p) => ({
      symbol: p.isin || p.tradingsymbol,
      tradingSymbol: p.tradingsymbol,
      exchange: p.exchange,
      shares_owned: p.quantity,
      avg_price: p.average_price,
      current_value: p.last_price * p.quantity,
      pnl: p.pnl,
      pnl_percent: p.day_change_percentage,
    }));
  }

  async getTrades() {
    const resp = await axios.get(`${BASE}/order/trades/get-trades-for-day`, { headers: this._headers() });
    const data = resp.data?.data || [];
    return data.map((t) => ({
      symbol: t.tradingsymbol,
      qty: t.quantity,
      price: t.average_price,
      type: t.transaction_type === "BUY" ? "by" : "sl",
      date: t.exchange_timestamp,
      orderId: t.order_id,
    }));
  }

  async getMargins() {
    const resp = await axios.get(`${BASE}/user/get-funds-and-margin`, { headers: this._headers() });
    const equity = resp.data?.data?.equity || {};
    return {
      total: equity.net || 0,
      available: equity.available_margin || 0,
      used: equity.utilised_margin || 0,
    };
  }
}
