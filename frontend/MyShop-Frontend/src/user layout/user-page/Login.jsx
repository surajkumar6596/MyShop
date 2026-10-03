import { useState, useEffect } from "react";
import "../user-style/login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

  useEffect(() => {
    // Check if previous login session has expired (1 day check)
    const loginTime = localStorage.getItem("login_time");
    if (loginTime) {
      const currentTime = new Date().getTime();
      const timePassed = currentTime - parseInt(loginTime, 10);

      if (timePassed > ONE_DAY_IN_MS) {
        // 1 Din poora ho gaya -> Clear old data
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        localStorage.removeItem("login_time");
        window.dispatchEvent(new Event("storage"));
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login/`,
        formData,
      );

      console.log("login success :", response.data);
      // 1 access and refresh token
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("login_time", new Date().getTime().toString());
      window.dispatchEvent(new Event("storage"));
      alert("Login Successful!");
      navigate("/");
    } catch (error) {
      console.error("Login Error : ", error.response?.data);
      setErrorMessage(
        error.response?.data?.detail || "Invalide Username or Password",
      );
    }
  };

  return (
    <div className="login_page">
      <h2>Login</h2>
      {errorMessage && (
        <p className="error_text" style={{ color: "red" }}>
          {errorMessage}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="users">
          <input
            type="text"
            name="username"
            id=""
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="password">
          <input
            type="password"
            name="password"
            id=""
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="login_btn" type="submit">
          Login
        </button>

        <div className="signup_link">
          <span>Already have account ?</span>
          <Link to={"/signup"}>Signup</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
