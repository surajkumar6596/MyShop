import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../user-style/signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    gender: "male",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Sirf numbers allow karein aur max 10 digits tak limit karein
      if (value === "" || (/^\d+$/.test(value) && value.length <= 10)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    axios
      .post("http://127.0.0.1:8000/api/signup/", formData)
      .then(() => {
        alert("Account created successfully!");
        setLoading(false);
        navigate("/login");
      })
      .catch((err) => {
        setLoading(false);
        console.error("Signup Error:", err.response?.data);
        if (err.response?.data) {
          const apiErrors = err.response.data;
          const firstKey = Object.keys(apiErrors)[0];
          const firstMsg = apiErrors[firstKey];
          setError(`${firstKey}: ${Array.isArray(firstMsg) ? firstMsg[0] : firstMsg}`);
        } else {
          setError("Something went wrong. Please try again.");
        }
      });
  };

  return (
    <div className="signup_page">
      <h2>Create Account</h2>

      {error && <p className="error_msg">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="input_group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input_group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input_group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            placeholder="Enter first name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>

        <div className="input_group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            placeholder="Enter last name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>

        <div className="input_group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="gender">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="input_group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit_btn" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <p style={{ marginTop: "15px", fontSize: "14px" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Signup;