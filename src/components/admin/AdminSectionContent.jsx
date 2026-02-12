import React from "react";

export default function AdminSectionContent({
  activeSection,
  sections,
  products,
  orders,
  orderItems,
  messages,
  formData,
  handleChange,
  handleSubmit,
  editingId,
  setEditingId,
  setFormData,
  categoryOptions,
  handleEdit,
  handleDelete,
  popularProducts,
  cartEvents,
  dailySales,
  cartAnalytics,
  mostAddedToCart,
  productVariants,
  setActiveSection,
}) {
  const lowStockProducts = products.filter((p) => p.stock < 10);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = React.useState(false);

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const closeOrderDetails = () => {
    setIsOrderDetailsOpen(false);
    setSelectedOrder(null);
  };

  if (activeSection === "overview") {
    const totalProducts = products.length;
    const lowStockCount = lowStockProducts.length;
    const totalOrders = orders.length;
    const unreadMessages = messages.filter((m) => m.unread).length;

    return (
      <div className="p-4 bg-white rounded shadow mt-4">
        <h2 className="text-lg font-semibold mb-4">Dashboard Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="text-sm text-gray-600">Total Products</h3>
            <p className="text-2xl font-bold text-blue-700">{totalProducts}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <h3 className="text-sm text-gray-600">Low Stock Items</h3>
            <p className="text-2xl font-bold text-red-700">{lowStockCount}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="text-sm text-gray-600">Total Orders</h3>
            <p className="text-2xl font-bold text-green-700">{totalOrders}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <h3 className="text-sm text-gray-600">Unread Messages</h3>
            <p className="text-2xl font-bold text-yellow-700">
              {unreadMessages}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Quick Add Product</h3>
          <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-50 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full border p-2 rounded"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="w-full border p-2 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock Quantity"
                className="w-full border p-2 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
                min="0"
              />
              <input
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full border p-2 rounded"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border p-2 rounded"
                rows="1"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              {editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: "",
                    description: "",
                    category: "",
                    price: "",
                    image_url: "",
                    stock: "",
                  });
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 ml-2"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {lowStockProducts.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <p className="text-sm text-red-700">
                  {lowStockProducts.length} product(s) are running low on stock
                </p>
              </div>
            )}
            {unreadMessages > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                <p className="text-sm text-yellow-700">
                  You have {unreadMessages} unread message(s)
                </p>
              </div>
            )}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <p className="text-sm text-blue-700">System is running smoothly</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === "products") {
    return (
      <div className="p-4 bg-white rounded shadow mt-4">
        <h2 className="text-lg font-semibold mb-4">Product Management</h2>
        <form onSubmit={handleSubmit} className="space-y-3 mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium text-gray-700">
            {editingId ? "Edit Product" : "Add New Product"}
          </h3>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
            rows="3"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border p-2 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
          />
          <input
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="Image URL (e.g., /pro1.jpg or https://...)"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock Quantity"
            className="w-full border p-2 rounded [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            required
            min="0"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              {editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: "",
                    description: "",
                    category: "",
                    price: "",
                    image_url: "",
                    stock: "",
                  });
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-right">Price</th>
                <th className="p-2 text-right">Stock</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No products found. Add your first product above!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-t hover:bg-gray-50">
                    <td className="p-2">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "/placeholder.jpg";
                        }}
                      />
                    </td>
                    <td className="p-2">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    </td>
                    <td className="p-2">{product.category}</td>
                    <td className="p-2 text-right">₱{product.price.toFixed(2)}</td>
                    <td className="p-2 text-right">
                      <span className={product.stock < 10 ? "text-red-600 font-medium" : ""}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeSection === "orders") {
    return (
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50 shadow-sm">
        <div className="border-b border-slate-200 bg-white/90 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Orders & Checkouts</h2>
          <p className="text-xs text-slate-500 mt-1">
            Monitor customer orders, totals, and status in one place.
          </p>
        </div>
        <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <h3 className="text-xs uppercase tracking-wide text-purple-700">Total Orders</h3>
            <p className="text-2xl font-bold text-purple-900 mt-1">{orders.length}</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <h3 className="text-xs uppercase tracking-wide text-emerald-700">Total Items Sold</h3>
            <p className="text-2xl font-bold text-emerald-900 mt-1">
              {orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0)}
            </p>
          </div>
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
            <h3 className="text-xs uppercase tracking-wide text-sky-700">Total Revenue</h3>
            <p className="text-2xl font-bold text-sky-900 mt-1">
              PHP {orders.reduce((sum, order) => sum + Number(order.total || 0), 0).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-slate-100">
                <th className="px-3 py-3 text-left font-semibold">Order ID</th>
                <th className="px-3 py-3 text-left font-semibold">Customer</th>
                <th className="px-3 py-3 text-left font-semibold">Date</th>
                <th className="px-3 py-3 text-right font-semibold">Total</th>
                <th className="px-3 py-3 text-left font-semibold">Status</th>
                <th className="px-3 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-500">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const status = (order.status || "Completed").toString();
                  const statusClass =
                    status.toLowerCase() === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : status.toLowerCase() === "cancelled"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-700";
                  return (
                    <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                      <td className="px-3 py-3 font-mono text-xs text-slate-700">
                        {String(order.id).slice(0, 8)}...
                      </td>
                      <td className="px-3 py-3 font-mono text-xs text-slate-600">
                        {String(order.user_id || "Guest").slice(0, 8)}
                        {order.user_id ? "..." : ""}
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-slate-900">
                        PHP {Number(order.total || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => openOrderDetails(order)}
                            className="cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {isOrderDetailsOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
                <h3 className="text-lg font-semibold text-slate-900">Order Details</h3>
                <button
                  type="button"
                  onClick={closeOrderDetails}
                  className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                >
                  X
                </button>
              </div>
              <div className="p-5 space-y-4 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Order ID</p>
                    <p className="font-mono text-slate-800 mt-1">{String(selectedOrder.id)}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Customer</p>
                    <p className="font-mono text-slate-800 mt-1">{String(selectedOrder.user_id || "Guest")}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Date</p>
                    <p className="text-slate-800 mt-1">
                      {selectedOrder.created_at
                        ? new Date(selectedOrder.created_at).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
                    <p className="font-semibold text-slate-900 mt-1">
                      PHP {Number(selectedOrder.total || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Items</h4>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700">
                          <th className="px-3 py-2 text-left font-semibold">Product</th>
                          <th className="px-3 py-2 text-right font-semibold">Price</th>
                          <th className="px-3 py-2 text-right font-semibold">Qty</th>
                          <th className="px-3 py-2 text-right font-semibold">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems
                          .filter((item) => item.order_id === selectedOrder.id)
                          .map((item) => {
                            const name =
                              item.products?.name ||
                              item.product_name ||
                              "Unknown Product";
                            const price = Number(item.price || 0);
                            const qty = Number(item.quantity || 0);
                            return (
                              <tr key={item.id} className="border-t border-slate-100">
                                <td className="px-3 py-2 text-slate-700">{name}</td>
                                <td className="px-3 py-2 text-right text-slate-700">
                                  PHP {price.toFixed(2)}
                                </td>
                                <td className="px-3 py-2 text-right text-slate-700">{qty}</td>
                                <td className="px-3 py-2 text-right font-medium text-slate-900">
                                  PHP {(price * qty).toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    );
  }

  if (activeSection === "messages") {
    return (
      <div className="p-4 bg-white rounded shadow mt-4">
        <h2 className="text-lg font-semibold mb-4">Customer Messages</h2>
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg border ${
                message.unread ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
              } hover:shadow-md transition`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {message.customer}
                    {message.unread && (
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded">
                        New
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500">{message.email}</p>
                </div>
                <span className="text-xs text-gray-400">{message.date.toLocaleString()}</span>
              </div>
              <h4 className="font-medium text-sm text-gray-700 mb-1">{message.subject}</h4>
              <p className="text-sm text-gray-600">{message.preview}</p>
            </div>
          ))}
        </div>

      </div>
    );
  }

  if (activeSection === "notifications") {
    return (
      <div className="p-4 bg-white rounded shadow mt-4">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-semibold mb-3 text-red-700">Low Stock Alerts</h3>
            {lowStockProducts.length === 0 ? (
              <p className="text-gray-500">All products are well-stocked!</p>
            ) : (
              <div className="space-y-2">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-red-800">{product.name}</p>
                      <p className="text-sm text-red-600">
                        Only {product.stock} left in stock - Restock needed!
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveSection("products");
                        handleEdit(product);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded text-xs hover:bg-red-600"
                    >
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === "analytics") {
    return (
      <div className="p-4 bg-white rounded shadow mt-4">
        <h2 className="text-2xl font-semibold mb-6">Analytics Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Popular Products</p>
            <p className="text-2xl font-bold text-blue-700">{popularProducts.length}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Cart Events</p>
            <p className="text-2xl font-bold text-purple-700">{cartEvents.length}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Daily Sales Rows</p>
            <p className="text-2xl font-bold text-green-700">{dailySales.length}</p>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Most Added to Cart</p>
            <p className="text-2xl font-bold text-orange-700">{mostAddedToCart.length}</p>
          </div>
          <div className="bg-pink-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Cart Analytics Rows</p>
            <p className="text-2xl font-bold text-pink-700">{cartAnalytics.length}</p>
          </div>
          <div className="bg-teal-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Product Variants</p>
            <p className="text-2xl font-bold text-teal-700">{productVariants.length}</p>
          </div>
        </div>
      </div>
    );
  }

  const section = sections.find((s) => s.key === activeSection);
  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h2 className="text-lg font-semibold mb-2">{section?.label}</h2>
      <p className="text-gray-700 text-sm">{section?.description}</p>
    </div>
  );
}



