import { useState, useEffect, useMemo } from "react";
import { supabase } from "../utils/supabase";
import { ensureOrderMeta } from "../utils/orderMeta";

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      };
      const fetchOrders = async () => {
        const { data } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("user_id", user.id);
        setOrders(data || []);
      };
      fetchProfile();
      fetchOrders();
    }
  }, [user]);

  const orderMetaById = useMemo(() => {
    if (!user || orders.length === 0) return {};
    const mapped = {};
    orders.forEach((order) => {
      const meta = ensureOrderMeta({
        orderId: order.id,
        userId: user.id,
        customerEmail: user.email,
        createdAt: order.created_at,
      });
      mapped[String(order.id)] = meta;
    });
    return mapped;
  }, [orders, user]);

  if (!user) return <p>Please log in.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      {profile && (
        <div className="card bg-white p-4 mb-8">
          <p>
            <strong>Name:</strong> {profile.full_name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card bg-white p-4 mb-4">
            {(() => {
              const meta = orderMetaById[String(order.id)];
              return (
                <>
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Total:</strong> PHP {Number(order.total || 0).toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="order-status">{order.status || "Completed"}</span>
            </p>
            <p>
              <strong>Order Confirmation Email:</strong>{" "}
              Sent to {meta?.customerEmail || user.email}
              {meta?.emailSentAt
                ? ` on ${new Date(meta.emailSentAt).toLocaleString()}`
                : ""}
            </p>
            <p>
              <strong>Tracking Number:</strong>{" "}
              <span className="font-mono">{meta?.trackingNumber || "Pending"}</span>
            </p>
            <p>
              <strong>Tracking Status:</strong> {meta?.trackingStatus || "Order Placed"}
            </p>
            <ul>
              {order.order_items.map((item) => (
                <li key={item.id}>
                  {item.quantity}x {item.product_id} - PHP {Number(item.price || 0).toFixed(2)}
                </li>
              ))}
            </ul>
                </>
              );
            })()}
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;
