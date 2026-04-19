/**
 * BrokerAdapter — interface that every broker integration must implement.
 * Each adapter returns data in normalised PMServer format so the rest of
 * the application never needs to know which broker it is talking to.
 */
export class BrokerAdapter {
  /** @param {object} credentials — apiKey, apiSecret, accessToken, etc. */
  constructor(credentials) {
    this.credentials = credentials;
  }

  /** Returns the broker's display name */
  get name() { throw new Error("name() not implemented"); }

  /**
   * Returns the URL the user must visit to authorise this app.
   * Only relevant for OAuth brokers (Upstox, Fyers, Zerodha).
   */
  getAuthUrl() { return null; }

  /**
   * Exchange an auth code for an access token.
   * @param {string} code
   * @returns {Promise<{accessToken, refreshToken, expiry}>}
   */
  async exchangeCode(_code) { throw new Error("exchangeCode() not implemented"); }

  /**
   * @returns {Promise<Array<{symbol, shares_owned, avg_price, current_value, pnl}>>}
   */
  async getPositions() { throw new Error("getPositions() not implemented"); }

  /**
   * @returns {Promise<Array<{symbol, qty, price, type, date}>>}
   */
  async getTrades() { throw new Error("getTrades() not implemented"); }

  /**
   * @returns {Promise<{total, available, used}>}
   */
  async getMargins() { throw new Error("getMargins() not implemented"); }
}
