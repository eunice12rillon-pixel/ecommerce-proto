import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useToast } from "../components/toast-context";
import BackButton from "../components/BackButton";
import { readCart, writeCart } from "../utils/cartStorage";
import { logCartEvent } from "../utils/cartEvents";
import { addSellerMessage } from "../utils/sellerMessages";

export default function ProductView({ products = [], user }) {
  const { id } = useParams();
  const { showToast } = useToast();
  const productById = products.find((p) => String(p.id) === id);
  const legacyIndex = Number.parseInt(id, 10);
  const productByIndex = Number.isNaN(legacyIndex) ? null : products[legacyIndex];
  const product = productById ?? productByIndex;
  const [quantity, setQuantity] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  if (!product) return <p className="text-gray-500 p-6">Product not found.</p>;

  const handleAddToCart = () => {
    const cart = readCart(user);
    const existing = cart.find((p) => p.id === product.id);
    const previousQuantity = existing ? Number(existing.quantity || 1) : 0;

    if (existing) existing.quantity += quantity;
    else cart.push({ ...product, quantity });
    writeCart(user, cart);
    logCartEvent({
      user,
      productId: product.id,
      eventType: "add",
      quantity,
      previousQuantity,
    });

    showToast("add to cart successfully");
  };

  const handleSendSellerMessage = () => {
    const message = chatMessage.trim();
    if (!message) {
      showToast("Type your message first.");
      return;
    }

    addSellerMessage({
      buyerName: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Customer",
      buyerEmail: user?.email || "customer@artisan-alley.local",
      sellerName: product.sellerName,
      productName: product.name,
      content: message,
    });

    setChatMessage("");
    setIsChatOpen(false);
    showToast("Message sent to seller.");
  };

  const normalizedComments = (product.comments && product.comments.length > 0
    ? product.comments
    : [
        { buyerName: "Mika Santos", rating: 5, text: "Great item, good quality." },
        {
          buyerName: "John Reyes",
          rating: 4.8,
          text: "Seller is responsive and helpful.",
        },
      ]
  ).map((comment, idx) => {
    if (typeof comment === "string") {
      const fallbackBuyers = ["Anna Cruz", "Paolo Dela Rosa", "Ivy Ramos"];
      return {
        buyerName: fallbackBuyers[idx % fallbackBuyers.length],
        rating: Number((4.5 + (idx % 5) * 0.1).toFixed(1)),
        text: comment,
      };
    }
    return {
      buyerName: comment.buyerName || `Buyer ${idx + 1}`,
      rating: Number(comment.rating ?? 4.7),
      text: comment.text || "Great product.",
    };
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <BackButton fallbackTo="/products" label="Back" />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-2xl shadow-md"
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <span className="text-gray-500">
              {Number(product.soldCount ?? 0)} sold
            </span>
            <span>{Number(product.rating ?? 4.7).toFixed(1)}</span>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-sm text-gray-600">
            Seller:{" "}
            <span className="font-semibold text-gray-800">
              {product.sellerName || "Artisan Seller"}
            </span>
          </p>
          <p className="text-2xl font-bold">
            ₱{product.price.toLocaleString()}
          </p>

          <div className="flex items-center gap-4 mt-4">
            <span className="font-medium">Quantity:</span>
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 bg-gray-200 rounded-full font-bold hover:bg-gray-300 transition"
            >
              -
            </button>
            <span className="w-10 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 bg-gray-200 rounded-full font-bold hover:bg-gray-300 transition"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Add to Cart
          </button>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              🔒 Secure Checkout
            </span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              🛍️ Quality Guaranteed
            </span>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              🔁 Easy Returns
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="text-xl font-semibold">Seller Profile</h2>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
              {(product.sellerAvatarLetter || product.sellerName || "A")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {product.sellerName || "Artisan Seller"}
              </p>
              <p className="text-sm text-gray-600">Active seller</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsChatOpen((value) => !value)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Chat Seller
          </button>
        </div>
        {isChatOpen && (
          <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to {product.sellerName || "Artisan Seller"}
            </label>
            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded p-2 text-sm"
              placeholder="Hi seller, is this item available?"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleSendSellerMessage}
                className="px-3 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
              >
                Send
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChatOpen(false);
                  setChatMessage("");
                }}
                className="px-3 py-2 rounded bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-xl font-semibold mb-3">Customer Comments</h2>
        <div className="space-y-3">
          {normalizedComments.map((comment, idx) => (
            <div key={idx} className="rounded-lg bg-gray-50 p-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-semibold">
                  {comment.buyerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{comment.buyerName}</p>
                    <span className="text-sm text-gray-700">
                      {Number(comment.rating).toFixed(1)}
                    </span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-sm text-gray-700">{comment.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Products */}
      {products.length > 1 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => p.id !== product.id)
              .slice(0, 3)
              .map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${encodeURIComponent(p.id)}`}
                  className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition flex flex-col"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded-xl mb-2"
                  />
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-gray-600 text-sm">{p.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-sm font-medium text-gray-700">
                    <span className="text-gray-500">
                      {Number(p.soldCount ?? 0)} sold
                    </span>
                    <span>{Number(p.rating ?? 4.7).toFixed(1)}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="font-bold mt-2">₱{p.price.toLocaleString()}</p>
                </Link>
              ))}
          </div>
        </div>
      )}

    </div>
  );
}
