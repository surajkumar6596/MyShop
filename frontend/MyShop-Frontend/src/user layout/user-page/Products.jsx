import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../user-style/product.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Data Fetching Function
  const fetchProducts = () => {
    console.log("API URL:", import.meta.env.VITE_API_URL);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/`)
      .then((res) => {
        // setProducts(res.data?.results || res.data || []);
         console.log("PRODUCT API RESPONSE:", res.data);
        setProducts(
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.results)
              ? res.data.results
              : [],
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products", err);
        setLoading(false);
      });
  };

  // 2. Single Combined useEffect
  useEffect(() => {
    fetchProducts();

    const handleFocus = () => {
      fetchProducts();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleAddToCart = (productId) => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please login first to add products to cart!");
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/cart/`,
        {
          product_id: productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )
      .then(() => {
        alert("Added to cart successfully !");
      })
      .catch((err) => {
        console.error("Failed add to cart:", err.response?.data || err);
        if (err.response?.status === 401) {
          alert("Session expired. Please login again!");
        } else {
          alert("Failed to add product to cart.");
        }
      });
  };

  // Single Product Buy Direct Handler
  const handleBuyNow = (item) => {
    navigate("/buy", {
      state: {
        product: {
          id: item.id,
          name: item.name || item.title,
          price: item.price,
          quantity: 1,
        },
      },
    });
  };

  if (loading) {
    return (
      <h3 style={{ textAlign: "center", marginTop: "40px" }}>
        Loading products...
      </h3>
    );
  }

  return (
    <div className="product_page">
      <h2>All Products</h2>

      {products.length === 0 ? (
        <p>No products found...</p>
      ) : (
        <div className="product">
          {products.map((item) => (
            <div className="card" key={item.id}>
              <div className="img_box">
                <img
                  src={item.image || "https://via.placeholder.com/200"}
                  alt={item.name}
                />
              </div>

              <div className="name_price">
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
              </div>

              <p className="description">Description: {item.descriptions}</p>

              <div className="cart_buy">
                <button
                  className="cart"
                  onClick={() => handleAddToCart(item.id)}
                >
                  Add to cart
                </button>
                <button className="buy" onClick={() => handleBuyNow(item)}>
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
