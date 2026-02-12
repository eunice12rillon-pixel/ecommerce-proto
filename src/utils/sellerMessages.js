const SELLER_MESSAGES_KEY = "seller_messages_v1";

export const readSellerMessages = () => {
  try {
    const raw = localStorage.getItem(SELLER_MESSAGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addSellerMessage = ({
  buyerName,
  buyerEmail,
  sellerName,
  productName,
  content,
}) => {
  const messages = readSellerMessages();
  const newMessage = {
    id: `msg-${Date.now()}`,
    buyerName: buyerName || "Customer",
    buyerEmail: buyerEmail || "customer@artisan-alley.local",
    sellerName: sellerName || "Artisan Seller",
    productName: productName || "Product",
    content: content || "",
    createdAt: new Date().toISOString(),
    unread: true,
  };
  messages.unshift(newMessage);
  localStorage.setItem(SELLER_MESSAGES_KEY, JSON.stringify(messages));
  window.dispatchEvent(new Event("seller-messages-updated"));
  return newMessage;
};

export const getDashboardMessages = (baseMessages = []) => {
  const sellerMessages = readSellerMessages().map((msg) => ({
    id: msg.id,
    customer: msg.buyerName,
    email: msg.buyerEmail,
    subject: `Inquiry: ${msg.productName}`,
    preview: msg.content,
    date: new Date(msg.createdAt),
    unread: Boolean(msg.unread),
  }));

  return [...sellerMessages, ...baseMessages].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
};
