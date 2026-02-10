import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

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
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Total:</strong> ${order.total}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="order-status">{order.status}</span>
            </p>
            <ul>
              {order.order_items.map((item) => (
                <li key={item.id}>
                  {item.quantity}x {item.product_id} - ${item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;
