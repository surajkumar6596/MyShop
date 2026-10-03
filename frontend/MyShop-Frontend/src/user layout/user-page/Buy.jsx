import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../user-style/buy.css";

const Buy = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state || {};
  const productData = stateData.product || null;
  const cartItemsData = stateData.items || null;

  const [shippingInfo, setShippingInfo] = useState({
    full_name: "",
    phone: "",
    shipping_address: "",
    city: "",
    postal_code: "",
    payment_method: "COD",
  });

  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState("");

  const prepareOrderItems = () => {
    if (
      cartItemsData &&
      Array.isArray(cartItemsData) &&
      cartItemsData.length > 0
    ) {
      return cartItemsData.map((item) => {
        const pId =
          item.product?.id || item.product_id || item.product || item.id;
        return {
          product: Number(pId),
          price: Number(item.price || item.product?.price || 0),
          quantity: Number(item.quantity || 1),
        };
      });
    }

    if (productData) {
      const pId =
        productData.id ||
        productData._id ||
        productData.product_id ||
        (typeof productData.product === "object"
          ? productData.product?.id
          : productData.product);

      return [
        {
          product: Number(pId),
          price: Number(productData.price || 0),
          quantity: Number(productData.quantity || 1),
        },
      ];
    }

    return [];
  };

  const itemsToSubmit = prepareOrderItems();
  const totalAmount = itemsToSubmit.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (value === "" || (/^\d+$/.test(value) && value.length <= 10)) {
        setShippingInfo({ ...shippingInfo, [name]: value });
      }
    } else {
      setShippingInfo({ ...shippingInfo, [name]: value });
    }
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors("");

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please login first to place an order");
      setLoading(false);
      navigate("/login");
      return;
    }

    if (
      itemsToSubmit.length === 0 ||
      itemsToSubmit.some((item) => !item.product || isNaN(item.product))
    ) {
      setErrors("Invalid product selected. Please try again.");
      setLoading(false);
      return;
    }

    const orderPayload = {
      full_name: shippingInfo.full_name,
      phone: shippingInfo.phone,
      shipping_address: shippingInfo.shipping_address,
      city: shippingInfo.city,
      postal_code: shippingInfo.postal_code,
      total_amount: totalAmount.toFixed(2),
      payment_method: shippingInfo.payment_method || "COD",
      items: itemsToSubmit,
    };

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/orders/checkout/`,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )
      .then(() => {
        setLoading(false);
        alert("🎉 Order Placed Successfully!");
        navigate("/products");
      })
      .catch((err) => {
        setLoading(false);
        console.error("Order Error details:", err.response?.data);
        if (err.response?.data) {
          setErrors(JSON.stringify(err.response.data));
        } else {
          setErrors("Failed to place order.");
        }
      });
  };

  return (
    <div className="buy_container">
      <h2>Checkout & Delivery Details</h2>

      {error && <p className="error_msg">{error}</p>}

      <div className="order_summary">
        <h3>Order Summary</h3>
        <p>
          <strong>Item:</strong>{" "}
          {productData?.name ||
            productData?.title ||
            (cartItemsData ? `${cartItemsData.length} Items` : "Product")}
        </p>
        <p>
          <strong>Total Price:</strong> ₹{totalAmount.toFixed(2)}
        </p>
      </div>

      <form onSubmit={handleOrderSubmit} className="buy_form">
        <div className="input_group">
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={shippingInfo.full_name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </div>

        <div className="input_group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleChange}
            maxLength="10"
            required
            placeholder="10 digit phone number"
          />
        </div>

        <div className="input_group">
          <label>Shipping Address</label>
          <textarea
            name="shipping_address"
            value={shippingInfo.shipping_address}
            onChange={handleChange}
            required
            placeholder="Enter street, area address"
          />
        </div>

        <div className="input_group">
          <label>City</label>
          <input
            type="text"
            name="city"
            value={shippingInfo.city}
            onChange={handleChange}
            required
            placeholder="City"
          />
        </div>

        <div className="input_group">
          <label>Postal Code</label>
          <input
            type="text"
            name="postal_code"
            value={shippingInfo.postal_code}
            onChange={handleChange}
            required
            placeholder="Pincode"
          />
        </div>

        <div className="input_group">
          <label>Payment Method</label>
          <select
            name="payment_method"
            value={shippingInfo.payment_method}
            onChange={handleChange}
          >
            <option value="COD">Cash on Delivery (COD)</option>
            <option value="UPI">UPI / Online</option>
          </select>
        </div>

        <button type="submit" className="submit_btn" disabled={loading}>
          {loading ? "Placing Order..." : "Confirm & Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Buy;
