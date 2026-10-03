import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../user-style/OrdersPage.css";
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Order Cancel Handler
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Kya aap is order ko cancel karna chahte hain?"))
      return;

    setActionLoading(orderId);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/cancel/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // UI State update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Cancelled" } : order,
        ),
      );
    } catch (err) {
      alert("Order cancel nahi ho saka. Dobara koshish karein.");
    } finally {
      setActionLoading(null);
    }
  };

  // Re-Order Handler (Cart me items dubara add karne ke liye)
  const handleReorder = (items) => {
    let existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    items.forEach((item) => {
      const foundIndex = existingCart.findIndex(
        (cItem) => cItem.id === item.product,
      );
      if (foundIndex > -1) {
        existingCart[foundIndex].quantity += item.quantity;
      } else {
        existingCart.push({
          id: item.product,
          name: item.product_name,
          price: item.price,
          image: item.product_image,
          quantity: item.quantity,
        });
      }
    });

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("storage"));
    navigate("/cart");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="orders_status_msg">Loading your orders...</div>;
  }

  return (
    <div className="orders_wrapper">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <div className="orders_status_msg">
          <p>Aapne abhi tak koi order place nahi kiya hai.</p>
          <button onClick={() => navigate("/products")}>Shop Now</button>
        </div>
      ) : (
        <div className="orders_cards_container">
          {orders.map((order) => (
            <div key={order.id} className="order_card">
              {/* Order Top Bar */}
              <div className="order_card_header">
                <div>
                  <span className="order_id_txt">Order #{order.id}</span>
                  <span className="order_date_txt">
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <span className={`status_badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              {/* Items List */}
              <div className="order_items_body">
                {order.items.map((item) => (
                  <div key={item.id} className="item_row">
                    <img
                      src={
                        item.product_image || "https://via.placeholder.com/80"
                      }
                      alt={item.product_name}
                      className="item_thumb"
                    />
                    <div className="item_info">
                      <h4 className="item_title">{item.product_name}</h4>
                      <div className="item_meta">
                        <span>Quantity: {item.quantity}</span>
                        <span className="item_price">₹{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer Actions */}
              <div className="order_card_footer">
                <div className="order_total">
                  Total: <span>₹{order.total_amount}</span>
                </div>

                <div className="action_btns">
                  {/* Cancel Button - Only when Pending */}
                  {order.status === "Pending" && (
                    <button
                      className="btn_cancel"
                      disabled={actionLoading === order.id}
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      {actionLoading === order.id
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  )}

                  {/* Re-order Button */}
                  <button
                    className="btn_reorder"
                    onClick={() => handleReorder(order.items)}
                  >
                    Re-Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
