import React, { useState, useEffect } from "react";
import { useToast } from "../components/ToastContext";
import BackButton from "../components/BackButton";
import { readCart, writeCart, clearCart } from "../utils/cartStorage";
import { supabase } from "../utils/supabase";
import { logCartEvent } from "../utils/cartEvents";

export default function CartPage({ user }) {
  const [cartItems, setCartItems] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [checkoutDetails, setCheckoutDetails] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    zipCode: "",
    paymentMethod: "",
  });
  const { showToast } = useToast();

  // Compute total dynamically
  const computeTotal = (items) => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0,
    );
    return subtotal - discountAmount;
  };

  useEffect(() => {
    const cart = readCart(user);
    setCartItems(cart);
    setTotal(computeTotal(cart));
  }, [discountAmount, user]);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    writeCart(user, updatedCart);
    setTotal(computeTotal(updatedCart));
  };

  const handleQuantityChange = (index, delta) => {
    const updatedCart = [...cartItems];
    const previousQuantity = Number(updatedCart[index].quantity || 1);

    if (!updatedCart[index].quantity) updatedCart[index].quantity = 1;
    updatedCart[index].quantity += delta;
    if (updatedCart[index].quantity < 1) updatedCart[index].quantity = 1;

    logCartEvent({
      user,
      productId: updatedCart[index].id,
      eventType: delta > 0 ? "add" : "remove",
      quantity: Math.abs(delta),
      previousQuantity,
    });

    updateCart(updatedCart);
  };

  const handleRemoveItem = (index) => {
    const updatedCart = [...cartItems];
    const removedItem = updatedCart[index];
    updatedCart.splice(index, 1);

    if (removedItem) {
      logCartEvent({
        user,
        productId: removedItem.id,
        eventType: "remove",
        quantity: Number(removedItem.quantity || 1),
        previousQuantity: Number(removedItem.quantity || 1),
      });
    }

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

  const isCheckoutFormValid =
    checkoutDetails.fullName.trim() &&
    checkoutDetails.phone.trim() &&
    checkoutDetails.address.trim() &&
    checkoutDetails.city.trim() &&
    checkoutDetails.province.trim() &&
    checkoutDetails.zipCode.trim() &&
    checkoutDetails.paymentMethod.trim();
  const canCheckout = Boolean(user);

  const handleDetailsChange = (field, value) => {
    setCheckoutDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!user) {
      showToast("Log in first to continue checkout.");
      return;
    }
    if (!isCheckoutFormValid) {
      showToast("Please complete delivery details and payment method.");
      return;
    }

    const subtotal = cartItems.reduce(
      (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1),
      0,
    );
    const orderTotal = Math.max(0, subtotal - discountAmount);

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user.id,
          total: orderTotal,
        },
      ])
      .select("id")
      .single();

    if (orderError || !orderData?.id) {
      console.error("Error creating order:", orderError);
      showToast("Checkout failed. Could not save order.");
      return;
    }

    if (cartItems.length > 0) {
      const orderItemsPayload = cartItems.map((item) => {
        const idAsString = String(item.id ?? "");
        const isHardcoded = idAsString.startsWith("hardcoded-");

        return {
          order_id: orderData.id,
          product_id: isHardcoded ? null : item.id,
          quantity: Number(item.quantity || 1),
          price: Number(item.price || 0),
          product_name: item.name ?? null,
          product_category: item.category ?? null,
          product_image_url: item.image ?? null,
        };
      });

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsPayload);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        showToast(
          "Checkout saved, but some order items were not recorded correctly.",
        );
      }
    }

    showToast("Checkout successful!");

    import("canvas-confetti").then((confetti) => {
      confetti.default({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
      });
    });

    // Clear cart after checkout
    clearCart(user);
    setCartItems([]);
    setTotal(0);
    setDiscountAmount(0);
    setDiscountCode("");
    setCheckoutDetails({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      zipCode: "",
      paymentMethod: "",
    });
  };

  const handleClearCart = () => {
    clearCart(user);
    setCartItems([]);
    setTotal(0);
    setDiscountAmount(0);
    setDiscountCode("");
    setCheckoutDetails({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      zipCode: "",
      paymentMethod: "",
    });
    showToast("Cart cleared!");
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-6 gap-6">
      {/* Cart Items */}
      <div className="flex-1 space-y-4">
        <BackButton fallbackTo="/products" label="Back" />
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

          <div className="mb-5">
            <h3 className="font-semibold mb-2">Delivery Details</h3>
            <div className="space-y-2">
              <input
                type="text"
                value={checkoutDetails.fullName}
                onChange={(e) => handleDetailsChange("fullName", e.target.value)}
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded px-2 py-2"
              />
              <input
                type="text"
                value={checkoutDetails.phone}
                onChange={(e) => handleDetailsChange("phone", e.target.value)}
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded px-2 py-2"
              />
              <input
                type="text"
                value={checkoutDetails.address}
                onChange={(e) => handleDetailsChange("address", e.target.value)}
                placeholder="Street Address"
                className="w-full border border-gray-300 rounded px-2 py-2"
              />
              <input
                type="text"
                value={checkoutDetails.city}
                onChange={(e) => handleDetailsChange("city", e.target.value)}
                placeholder="City / Municipality"
                className="w-full border border-gray-300 rounded px-2 py-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={checkoutDetails.province}
                  onChange={(e) =>
                    handleDetailsChange("province", e.target.value)
                  }
                  placeholder="Province"
                  className="w-full border border-gray-300 rounded px-2 py-2"
                />
                <input
                  type="text"
                  value={checkoutDetails.zipCode}
                  onChange={(e) => handleDetailsChange("zipCode", e.target.value)}
                  placeholder="ZIP Code"
                  className="w-full border border-gray-300 rounded px-2 py-2"
                />
              </div>
              <select
                value={checkoutDetails.paymentMethod}
                onChange={(e) =>
                  handleDetailsChange("paymentMethod", e.target.value)
                }
                className="w-full border border-gray-300 rounded px-2 py-2 bg-white"
              >
                <option value="">Select Payment Method</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="GCash">GCash</option>
              </select>
            </div>
          </div>

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
            {!user && (
              <p className="text-sm font-medium text-red-600">
                Log in first before checkout.
              </p>
            )}
            {user && !isCheckoutFormValid && (
              <p className="text-sm font-medium text-amber-700">
                Complete delivery details and payment method to place order.
              </p>
            )}
            <button
              onClick={handleCheckout}
              disabled={!canCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {user ? "Continue to Checkout" : "Log in first"}
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
