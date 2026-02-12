import { supabase } from "./supabase";

const CART_SESSION_KEY = "cart_session_id";

const generateSessionId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const getCartSessionId = () => {
  const existing = localStorage.getItem(CART_SESSION_KEY);
  if (existing) return existing;

  const created = generateSessionId();
  localStorage.setItem(CART_SESSION_KEY, created);
  return created;
};

export const logCartEvent = async ({
  user,
  productId,
  variantId = null,
  eventType,
  quantity = 1,
  previousQuantity = 0,
}) => {
  if (!eventType) return;

  const payload = {
    user_id: user?.id ?? null,
    product_id: productId ? String(productId) : null,
    variant_id: variantId ? String(variantId) : null,
    event_type: eventType,
    quantity: Number(quantity || 0),
    previous_quantity: Number(previousQuantity || 0),
    session_id: getCartSessionId(),
  };

  const { error } = await supabase.from("cart_events").insert([payload]);

  if (error) {
    console.error("Failed to log cart event:", error.message);
  }
};
