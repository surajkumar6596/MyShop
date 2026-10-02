import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../user-style/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("User parsing failed:", e);
    }

    // Correct API Endpoint match: /api/orders/
    axios
      .get("http://127.0.0.1:8000/api/orders/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Orders fetch error:", err);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("login_time");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!user) return null;

  // Calculate order stats safely
  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (acc, item) => acc + Number(item.total_amount || 0),
    0
  );

  return (
    <div className="profile_wrapper">
      {/* Sidebar Section */}
      <aside className="profile_sidebar">
        <div className="avatar_box">
          <div className="avatar_circle">
            {(user.username || user.first_name || "U").charAt(0).toUpperCase()}
          </div>
          <h3>
            {user.first_name
              ? `${user.first_name} ${user.last_name || ""}`
              : user.username}
          </h3>
          <p className="user_email">{user.email || "No Email Registered"}</p>
        </div>

        <nav className="sidebar_menu">
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            📦 My Orders
          </button>
          <button
            className={activeTab === "address" ? "active" : ""}
            onClick={() => setActiveTab("address")}
          >
            📍 Shipping Addresses
          </button>
          <button className="logout_btn_sidebar" onClick={handleLogout}>
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="profile_main">
        {/* Quick Stats */}
        <div className="stats_cards">
          <div className="stat_card">
            <h4>Total Orders</h4>
            <p>{totalOrders}</p>
          </div>
          <div className="stat_card">
            <h4>Total Spent</h4>
            <p>₹{totalSpent.toLocaleString()}</p>
          </div>
          <div className="stat_card">
            <h4>Account Status</h4>
            <p className="status_active">Active</p>
          </div>
        </div>

        {/* Dynamic Tab Content */}
        {activeTab === "orders" ? (
          <div className="tab_content">
            <h3>Order History</h3>
            {loading ? (
              <p>Loading your orders...</p>
            ) : orders.length === 0 ? (
              <div className="empty_state">
                <p>Aapne abhi tak koi order nahi kiya hai.</p>
                <button onClick={() => navigate("/products")}>Shop Now</button>
              </div>
            ) : (
              <div className="order_body">
                {orders.map((singleOrder) => (
                  <div className="profile_order_card" key={singleOrder.id}>
                    <div className="order_header_meta">
                      <span><strong>Order #{singleOrder.id}</strong></span>
                      <span>{formatDate(singleOrder.created_at)}</span>
                      <span className={`status_badge ${singleOrder.status?.toLowerCase()}`}>
                        {singleOrder.status}
                      </span>
                    </div>

                    {singleOrder.items && singleOrder.items.map((item, idx) => (
                      <div className="product_row" key={idx}>
                        <img
                          src={
                            item.product_image ||
                            "https://via.placeholder.com/60?text=No+Image"
                          }
                          alt={item.product_name}
                          className="product_img"
                        />
                        <div className="product_details">
                          <span className="product_name">{item.product_name}</span>
                          <span className="product_qty">x{item.quantity}</span>
                        </div>
                        <span className="product_price">₹{item.price}</span>
                      </div>
                    ))}

                    <div className="order_card_bottom">
                      <span>Total Amount: <strong>₹{singleOrder.total_amount}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="tab_content">
            <h3>Saved Addresses</h3>
            {orders.length > 0 ? (
              <div className="address_card">
                <p>
                  <strong>Name:</strong> {orders[0].full_name}
                </p>
                <p>
                  <strong>Phone:</strong> {orders[0].phone}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {orders[0].shipping_address}
                </p>
                <p>
                  <strong>City/Pincode:</strong> {orders[0].city} -{" "}
                  {orders[0].postal_code}
                </p>
              </div>
            ) : (
              <p>No saved delivery address found from recent orders.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;