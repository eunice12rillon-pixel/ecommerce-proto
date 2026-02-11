import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContext"; // ✅ Toast
import confetti from "canvas-confetti";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const { showToast } = useToast(); // ✅ Toast hook
  const navigate = useNavigate();

  // Compute total dynamically
  const computeTotal = (items) => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0,
    );
    return subtotal - discountAmount;
  };

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
    setTotal(computeTotal(cart));
  }, [discountAmount]);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setTotal(computeTotal(updatedCart));
  };

  const handleQuantityChange = (index, delta) => {
    const updatedCart = [...cartItems];
    if (!updatedCart[index].quantity) updatedCart[index].quantity = 1;
    updatedCart[index].quantity += delta;
    if (updatedCart[index].quantity < 1) updatedCart[index].quantity = 1;
    updateCart(updatedCart);
  };

  const handleRemoveItem = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    updateCart(updatedCart);
  };

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === "FRANCISPOGI") {
      const subtotal = cartItems.reduce(
        (acc, item) => acc + item.price * (item.quantity || 1),
        0,
      );
      setDiscountAmount(subtotal); // 100% discount
      setTotal(0);
      showToast("Discount applied! You pay ₱0.00");
    } else {
      setDiscountAmount(0);
      showToast("Invalid discount code");
      setTotal(computeTotal(cartItems));
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    showToast("Checkout successful!");

    import("canvas-confetti").then((confetti) => {
      confetti.default({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
      });
    });

    // Clear cart after checkout
    localStorage.removeItem("cart");
    setCartItems([]);
    setTotal(0);
    setDiscountAmount(0);
    setDiscountCode("");
  };

  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
    setTotal(0);
    setDiscountAmount(0);
    setDiscountCode("");
    showToast("Cart cleared!");
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-6 gap-6">
      {/* Cart Items */}
      <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is currently empty.</p>
        ) : (
          cartItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center bg-gray-50 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl mr-4"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.name}</h2>
                <p className="text-gray-600">{item.description}</p>
              </div>
              <div className="flex items-center gap-2 mx-4">
                <button
                  onClick={() => handleQuantityChange(idx, -1)}
                  className="w-8 h-8 bg-gray-200 rounded-full font-bold hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="w-6 text-center">{item.quantity || 1}</span>
                <button
                  onClick={() => handleQuantityChange(idx, 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full font-bold hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>
              <p className="font-bold text-lg w-24 text-right">
                ₱{(item.price * (item.quantity || 1)).toLocaleString()}
              </p>
              <button
                onClick={() => handleRemoveItem(idx)}
                className="ml-4 text-red-500 font-bold hover:text-red-700 transition"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* Checkout Sidebar */}
      {cartItems.length > 0 && (
        <div className="lg:w-96 bg-white rounded-2xl p-6 shadow-lg sticky top-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {/* Discount code */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Discount Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="Enter code"
                className="flex-1 border border-gray-300 rounded px-2 py-1"
              />
              <button
                onClick={applyDiscount}
                className="bg-black text-white px-4 py-1 rounded hover:opacity-90 transition"
              >
                Apply
              </button>
            </div>
          </div>

          <div className="flex justify-between mb-2 text-gray-600">
            <span>Subtotal</span>
            <span>
              ₱
              {cartItems
                .reduce(
                  (acc, item) => acc + item.price * (item.quantity || 1),
                  0,
                )
                .toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between mb-4 text-gray-600">
            <span>Shipping</span>
            <span>₱0</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between mb-2 text-green-600 font-semibold">
              <span>Discount ({discountCode.toUpperCase()})</span>
              <span>-₱{discountAmount.toLocaleString()}</span>
            </div>
          )}
          <hr className="border-gray-300 mb-4" />
          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>₱{total.toLocaleString()}</span>
          </div>

          {/* Checkout + Clear Cart Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Continue to Checkout
            </button>

            <button
              onClick={handleClearCart}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
