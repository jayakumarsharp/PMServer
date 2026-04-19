import BrokerCredential from "../model/BrokerCredential";
import { UpstoxAdapter } from "./brokers/UpstoxAdapter";
import { FyersAdapter } from "./brokers/FyersAdapter";
import { PortfolioTransactions } from "../model/portfoliotransactions";
import { securityMaster } from "../model/SecurityMaster";

const ADAPTERS = {
  upstox: UpstoxAdapter,
  fyers: FyersAdapter,
};

function getAdapter(cred) {
  const AdapterClass = ADAPTERS[cred.broker];
  if (!AdapterClass) throw new Error(`Unsupported broker: ${cred.broker}`);
  return new AdapterClass({
    apiKey: cred.apiKey,
    apiSecret: cred.apiSecret,
    accessToken: cred.accessToken,
    redirectUri: process.env.BROKER_REDIRECT_BASE
      ? `${process.env.BROKER_REDIRECT_BASE}/api/broker/callback/${cred.broker}`
      : `http://localhost:3003/api/broker/callback/${cred.broker}`,
  });
}

export async function getSupportedBrokers() {
  return Object.keys(ADAPTERS).map((key) => ({
    key,
    name: new ADAPTERS[key]({}).name,
  }));
}

export async function getAuthUrl(broker, userId) {
  // Create a placeholder credential so we have apiKey
  const cred = await BrokerCredential.findOne({ userId, broker }).lean();
  if (!cred?.apiKey) throw new Error("Connect your broker API key first via POST /api/broker/connect");
  const adapter = getAdapter(cred);
  return adapter.getAuthUrl();
}

export async function connectBroker({ userId, broker, apiKey, apiSecret }) {
  return BrokerCredential.findOneAndUpdate(
    { userId, broker },
    { apiKey, apiSecret, isActive: true, syncStatus: "idle" },
    { upsert: true, new: true }
  );
}

export async function handleOAuthCallback({ broker, code, userId }) {
  const cred = await BrokerCredential.findOne({ userId, broker });
  if (!cred) throw new Error("Broker not connected");
  const adapter = getAdapter(cred);
  const { accessToken, refreshToken, expiry } = await adapter.exchangeCode(code);
  cred.accessToken = accessToken;
  if (refreshToken) cred.refreshToken = refreshToken;
  if (expiry) cred.tokenExpiry = expiry;
  await cred.save();
  return { connected: true };
}

export async function syncBrokerPositions({ userId, broker, portfolioId }) {
  const cred = await BrokerCredential.findOne({ userId, broker, isActive: true });
  if (!cred?.accessToken) throw new Error("Broker not authorised — complete OAuth first");

  cred.syncStatus = "syncing";
  await cred.save();

  try {
    const adapter = getAdapter(cred);
    const positions = await adapter.getPositions();

    let imported = 0;
    for (const pos of positions) {
      // Try to resolve symbol in SecurityMaster
      let sec = await securityMaster.findOne({
        $or: [{ symbol: pos.symbol }, { symbol: pos.tradingSymbol }],
      }).lean();

      if (!sec && pos.tradingSymbol) {
        // Create a basic SecurityMaster entry if missing
        sec = await securityMaster.create({
          symbol: pos.tradingSymbol,
          shortname: pos.tradingSymbol,
          exchange: pos.exchange || "NSE",
        });
      }

      if (sec && pos.shares_owned > 0) {
        await PortfolioTransactions.findOneAndUpdate(
          { symbol: sec._id, portfolio_id: portfolioId, tran_code: "by" },
          {
            symbol: sec._id,
            shares_owned: pos.shares_owned,
            executed_price: pos.avg_price,
            cost_basis: pos.shares_owned * pos.avg_price,
            tran_code: "by",
            portfolio_id: portfolioId,
            createdBy: `sync:${broker}`,
          },
          { upsert: true }
        );
        imported++;
      }
    }

    cred.syncStatus = "success";
    cred.lastSyncedAt = new Date();
    cred.syncError = null;
    await cred.save();

    return { imported, positions: positions.length };
  } catch (err) {
    cred.syncStatus = "error";
    cred.syncError = err.message;
    await cred.save();
    throw err;
  }
}

export async function getBrokerStatus(userId) {
  return BrokerCredential.find({ userId }).select("-apiSecret -accessToken -refreshToken").lean();
}
