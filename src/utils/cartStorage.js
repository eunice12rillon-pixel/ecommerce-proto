const GUEST_CART_KEY = "cart_guest";

export const getCartStorageKey = (user) => {
  if (user?.id) return `cart_user_${user.id}`;
  return GUEST_CART_KEY;
};

export const readCart = (user) => {
  const key = getCartStorageKey(user);
  return JSON.parse(localStorage.getItem(key)) || [];
};

export const writeCart = (user, cart) => {
  const key = getCartStorageKey(user);
  localStorage.setItem(key, JSON.stringify(cart));
};

export const clearCart = (user) => {
  const key = getCartStorageKey(user);
  localStorage.removeItem(key);
};
