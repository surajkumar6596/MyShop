import React, { useEffect, useState } from "react";
import axios from "axios";
import "../user layout/user-style/AdminDashboard.css";
import {
  FaRupeeSign,
  FaShoppingBag,
  FaBoxOpen,
  FaUsers,
  FaExclamationTriangle,
  FaChartLine,
  FaBoxes,
  FaClipboardList,
  FaUserShield,
  FaShoppingCart,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdvancedAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [carts, setCarts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Clothes",
    price: "",
    descriptions: "",
    stock: 10,
    image_url: "",
  });

  const token = localStorage.getItem("access_token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (activeTab === "overview") fetchDashboardOverview();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "carts") fetchCarts();
    if (activeTab === "products") fetchProducts();
  }, [activeTab]);

  const fetchDashboardOverview = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/dashboard/`,
        { headers },
      );
      setDashboardData(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users/`,
        { headers },
      );
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/`,
        { headers },
      );
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchCarts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/carts/`,
        { headers },
      );
      setCarts(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/`,
        { headers },
      );
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "${import.meta.env.VITE_API_URL}/api/admin/product/add/",
        newProduct,
        { headers },
      );
      alert("Product Added Successfully!");
      setNewProduct({
        name: "",
        category: "Clothes",
        price: "",
        descriptions: "",
        stock: 10,
        image_url: "",
      });
      fetchProducts();
    } catch (err) {
      alert("Failed to add product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/admin/product/delete/${id}/`,
          { headers },
        );
        alert("Product Deleted");
        fetchProducts();
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="admin-dashboard-wrapper">
      {/* Sidebar Navigation */}
      <div className="admin-sidebar">
        <h2>🚀 Admin Hub</h2>
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          <FaChartLine /> Dashboard
        </button>
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          <FaBoxes /> Manage Products
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          <FaClipboardList /> All Orders
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          <FaUsers /> Registered Users
        </button>
        <button
          className={activeTab === "carts" ? "active" : ""}
          onClick={() => setActiveTab("carts")}
        >
          <FaShoppingCart /> Live Cart Monitor
        </button>
      </div>

      {/* Main Content Area */}
      <div className="admin-content">
        {/* 1. DASHBOARD OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            <div className="dashboard-header-flex">
              <div>
                <h1>Dashboard Overview</h1>
                <p>
                  Welcome back, Admin! Here is the current performance summary
                  of your store.
                </p>
              </div>
              <button
                onClick={fetchDashboardOverview}
                className="btn-secondary"
              >
                Refresh Data
              </button>
            </div>

            {loading ? (
              <p>Loading Analytics...</p>
            ) : (
              dashboardData && (
                <>
                  {/* Metric Cards Grid */}
                  <div className="metrics-grid">
                    <MetricCard
                      title="Total Revenue"
                      value={`₹${dashboardData.metrics?.total_revenue || 0}`}
                      icon={<FaRupeeSign />}
                      bgClass="bg-emerald"
                    />
                    <MetricCard
                      title="Total Orders"
                      value={dashboardData.metrics?.total_orders || 0}
                      icon={<FaShoppingBag />}
                      bgClass="bg-blue"
                    />
                    <MetricCard
                      title="Total Products"
                      value={dashboardData.metrics?.total_products || 0}
                      icon={<FaBoxOpen />}
                      bgClass="bg-indigo"
                    />
                    <MetricCard
                      title="Total Users"
                      value={dashboardData.metrics?.total_user || 0}
                      icon={<FaUsers />}
                      bgClass="bg-purple"
                    />
                    <MetricCard
                      title="Low Stock Alerts"
                      value={dashboardData.metrics?.low_stock || 0}
                      icon={<FaExclamationTriangle />}
                      bgClass="bg-rose"
                    />
                  </div>

                  {/* Monthly Sales Revenue Chart */}
                  <div className="dashboard-section card-box">
                    <h2 className="section-title">
                      Monthly Revenue & Orders Trend
                    </h2>
                    <div className="chart-wrapper">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dashboardData.monthly_sales}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            name="Revenue (₹)"
                          />
                          <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#10b981"
                            strokeWidth={2}
                            name="Total Orders"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Orders Summary */}
                  <div className="dashboard-section card-box">
                    <h2 className="section-title">Recent 5 Orders</h2>
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.recent_orders.map((ord) => (
                            <tr key={ord.id}>
                              <td>#{ord.id}</td>
                              <td>{ord.username}</td>
                              <td>₹{ord.total_amount}</td>
                              <td>
                                <span className={`badge ${ord.status}`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td>
                                {new Date(ord.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )
            )}
          </div>
        )}

        {/* 2. MANAGE PRODUCTS TAB */}
        {activeTab === "products" && (
          <div>
            <h1>Product Management</h1>
            <form onSubmit={handleAddProduct} className="product-form card-box">
              <h3>Add New Product</h3>
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
              />
              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothes">Clothes</option>
                <option value="Fashion">Fashion</option>
                <option value="Grocery">Grocery</option>
                <option value="Toys">Toys</option>
                <option value="Kids">Kids</option>
              </select>
              <input
                type="number"
                placeholder="Price (₹)"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.image_url}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, image_url: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                value={newProduct.descriptions}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, descriptions: e.target.value })
                }
                required
              />
              <button type="submit" className="btn-primary">
                Add Product
              </button>
            </form>

            <div className="card-box">
              <h3>Store Products Inventory ({products.length})</h3>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>#{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.category}</td>
                        <td>₹{p.price}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ALL ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="card-box">
            <h1>Customer Orders Detail</h1>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Phone & Address</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>
                        <b>{order.user_username}</b>
                        <br />
                        <small>{order.user_email}</small>
                      </td>
                      <td>
                        {order.phone}
                        <br />
                        {order.shipping_address}, {order.city}
                      </td>
                      <td>₹{order.total_amount}</td>
                      <td>
                        <span className={`badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. REGISTERED USERS TAB */}
        {activeTab === "users" && (
          <div className="card-box">
            <h1>Registered Users Directory ({users.length})</h1>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.username}</td>
                      <td>
                        {u.first_name} {u.last_name}
                      </td>
                      <td>{u.email || "N/A"}</td>
                      <td>{u.phone || "N/A"}</td>
                      <td>{u.gender || "N/A"}</td>
                      <td>{new Date(u.date_joined).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. LIVE CART MONITORING TAB */}
        {activeTab === "carts" && (
          <div className="card-box">
            <h1>Live Cart Items Tracking</h1>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Cart ID</th>
                    <th>User</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                    <th>Added Time</th>
                  </tr>
                </thead>
                <tbody>
                  {carts.map((c) => (
                    <tr key={c.id}>
                      <td>#{c.id}</td>
                      <td>
                        <b>{c.username}</b>
                        <br />
                        <small>{c.email}</small>
                      </td>
                      <td>{c.product_name}</td>
                      <td>{c.quantity}</td>
                      <td>₹{c.total_price}</td>
                      <td>{new Date(c.added_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Metric Card Sub-Component
const MetricCard = ({ title, value, icon, bgClass }) => {
  return (
    <div className="metric-card">
      <div>
        <p className="metric-title">{title}</p>
        <h3 className="metric-value">{value}</h3>
      </div>
      <div className={`metric-icon ${bgClass}`}>{icon}</div>
    </div>
  );
};

export default AdvancedAdminDashboard;
