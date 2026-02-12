const ORDER_META_KEY = "order_meta_v1";

const readMetaStore = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDER_META_KEY)) || {};
  } catch {
    return {};
  }
};

const writeMetaStore = (store) => {
  localStorage.setItem(ORDER_META_KEY, JSON.stringify(store));
};

export const buildTrackingNumber = (orderId) => {
  const base = String(orderId || "").replace(/-/g, "").slice(0, 10).toUpperCase();
  const stamp = String(Date.now()).slice(-6);
  return `AA-${base}-${stamp}`;
};

export const getOrderMeta = (orderId) => {
  if (!orderId) return null;
  const store = readMetaStore();
  return store[String(orderId)] || null;
};

export const saveOrderMeta = (orderId, meta) => {
  if (!orderId || !meta) return null;
  const store = readMetaStore();
  const key = String(orderId);
  store[key] = {
    ...(store[key] || {}),
    ...meta,
  };
  writeMetaStore(store);
  return store[key];
};

export const ensureOrderMeta = ({ orderId, userId, customerEmail, createdAt }) => {
  const existing = getOrderMeta(orderId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const initialMeta = {
    orderId: String(orderId),
    userId: userId || null,
    customerEmail: customerEmail || "",
    trackingNumber: buildTrackingNumber(orderId),
    trackingStatus: "Order Placed",
    emailSentAt: now,
    createdAt: createdAt || now,
    history: [
      {
        label: "Order Placed",
        at: now,
      },
    ],
  };

  return saveOrderMeta(orderId, initialMeta);
};

