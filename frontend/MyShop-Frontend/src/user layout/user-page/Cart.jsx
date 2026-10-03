import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../user-style/cart.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api/cart/`;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setErrorMsg("Please login to view your cart.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setCartItems(res.data?.results || res.data || []);
      setErrorMsg("");
    } catch (err) {
      console.error("Cart error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        setErrorMsg("Session expired. Please login again.");
      } else {
        setErrorMsg("Cart data load nahi ho paya.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantity = async (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    const token = localStorage.getItem("access_token");

    try {
      await axios.patch(
        `${API_URL}${id}/`,
        { quantity: newQty },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err.response?.data || err);
    }
  };

  const handleRemove = async (id) => {
    const token = localStorage.getItem("access_token");

    try {
      await axios.delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchCart();
    } catch (err) {
      console.error("Error deleting item:", err.response?.data || err);
    }
  };

  // Cart items Checkout Direct Handler
  const handleCartBuy = () => {
    if (cartItems.length === 0) return;

    navigate("/buy", {
      state: {
        items: cartItems.map((item) => ({
          id: item.product?.id || item.product_id || item.product,
          product: item.product?.id || item.product_id || item.product,
          price: item.product?.price || 0,
          quantity: item.quantity || 1,
          name: item.product?.name || item.product?.title,
        })),
      },
    });
  };

  const totalPrice = (cartItems || []).reduce(
    (acc, item) =>
      acc + Number(item.product?.price || 0) * (item.quantity || 1),
    0,
  );

  if (loading)
    return (
      <h3 style={{ textAlign: "center", marginTop: "40px" }}>
        Loading Cart...
      </h3>
    );

  if (errorMsg)
    return (
      <h3 style={{ textAlign: "center", marginTop: "40px", color: "red" }}>
        {errorMsg}
      </h3>
    );

  return (
    <div className="cart_container">
      <h2>My Cart</h2>

      {cartItems.length === 0 ? (
        <p className="empty_msg">Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div className="cart_card" key={item.id}>
              <div className="cart_img_box">
                <img src={item.product?.image} alt={item.product?.name} />
              </div>

              <div className="cart_info">
                <h4>{item.product?.name}</h4>
                <p className="cart_price">₹{item.product?.price}</p>
              </div>

              <div className="qty_box">
                <button
                  onClick={() => handleQuantity(item.id, item.quantity, -1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantity(item.id, item.quantity, 1)}
                >
                  +
                </button>
              </div>

              <button
                className="delete_btn"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="total_box">
            <strong>Total: ₹{totalPrice.toFixed(2)}</strong>
            <div>
              <button className="buy_btn" onClick={handleCartBuy}>
                Buy now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
