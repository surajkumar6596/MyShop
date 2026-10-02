import { Link } from "react-router-dom";
import "../user-style/home.css";

const Home = () => {
  return (
    <div className="home_container">
      {/* Hero Section */}
      <section className="hero_section">
        <div className="hero_content">
          <h1>Welcome to <span>MyShop</span></h1>
          <p>Discover top-quality products at unbeatable prices. Fast shipping and easy returns!</p>
          <div className="hero_btns">
            <Link to="/products" className="btn_primary">Shop Now</Link>
            <Link to="/signup" className="btn_secondary">Join Us</Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="features_section">
        <div className="feature_card">
          <div className="feature_icon">⚡</div>
          <h3>Fast Delivery</h3>
          <p>Get your items delivered within 24-48 hours across India.</p>
        </div>
        <div className="feature_card">
          <div className="feature_icon">🛡️</div>
          <h3>Secure Payment</h3>
          <p>100% safe transactions with encrypted payment processing.</p>
        </div>
        <div className="feature_card">
          <div className="feature_icon">🔄</div>
          <h3>Easy Returns</h3>
          <p>Hassle-free 7-day replacement and money-back guarantee.</p>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="cta_banner">
        <h2>Special Discounts Up To 50% Off!</h2>
        <p>Explore our wide collection of trending products today.</p>
        <Link to="/products" className="btn_cta">Explore Products</Link>
      </section>
    </div>
  );
};

export default Home;