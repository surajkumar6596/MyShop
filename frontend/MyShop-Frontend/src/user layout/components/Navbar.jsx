import "../user-style/navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

   const [searchQuery, setSearchQuery] = useState("");
    const [history, setHistory] = useState([]);
    const [showDropDown, setShowDropdown] = useState(false);
    const token = localStorage.getItem("access_token");

    // fetch history focus if user logged in
    const fetchSearchHistory = () => {
      if (token) {
        axios
          .get("http://127.0.0.1:8000/api/search-recommendations/", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setHistory(res.data.history || []);
          })
          .catch((err) => console.error("Error loading search history", err));
      } else {
        const localHistory = JSON.parse(localStorage.getItem("search_history")) || [];
        setHistory(localHistory);
      }
    };

    const handleSearchSubmit = (e, customQuery = null) => {
      if (e) e.preventDefault();
      const queryToSearch = customQuery || searchQuery;

      if (!queryToSearch.trim()) return;

      let localHistroy = JSON.parse(localStorage.getItem("search_history")) || [];
      localHistroy = [
        queryToSearch,
        ...localHistroy.filter((item) => item !== queryToSearch),
      ].slice(0, 5);
      localStorage.setItem("search_history", JSON.stringify(localHistroy));
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(queryToSearch)}`);
    };





  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    const loginTime = localStorage.getItem("login_time");
    const currentTime = new Date().getTime();

    // Check karein ki 1 day (24 Hours) ho chuka hai ya nahi
    if (loginTime && currentTime - parseInt(loginTime, 10) > ONE_DAY_IN_MS) {
      // Token Expire Ho Gaya -> Clear everything
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      localStorage.removeItem("login_time");
      setUser(null);
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("failed parse error", e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    // Custom storage event & tab switch listener
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, [location.pathname]); // Route change hone par bhi expiry verify hogi

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("login_time");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const getInitial = () => {
    if (!user) return "";
    const name = user.first_name || user.username || user.phone || "";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="nav">
      <div className="logo">
        <h2>MyShop</h2>
      </div>

      <div className="search_container">
        <form onSubmit={handleSearchSubmit} className="search_form">
          <input
            type="text"
            placeholder="Search product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              fetchSearchHistory();
              setShowDropdown(true);
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          />
          <button type="submit">Search</button>
        </form>

        {showDropDown && history.length > 0 && (
          <ul className="searh_history_dropsown">
            <li className="dropdown_header"> Recent Search</li>
            {history.map((item, index)=> (
              <li key={index}
              onMouseDown={()=>{
                setSearchQuery(item);
                handleSearchSubmit(null, item)
              }}> {item}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="page_link">
        <Link to={"/"}>Home</Link>
        <Link to={"/products"}> Products</Link>
        <Link to={"/cart"}> Cart</Link>
      </div>

      <div className="user_section">
        {user ? (
          <div className="user_profile">
            <div className="user_avatar" onClick={() => navigate("/profile")}>
              <span>{getInitial()}</span>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="page_link">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
