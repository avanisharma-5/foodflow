import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { auth } from "../firebase"; // Firebase config
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import "./Login.css"; // Custom styles

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem("user", JSON.stringify(user)); // Store user session
      alert("Login successful!");
      console.log("now opening foodlist");
      navigate("/foodlist"); // Redirect to food list page
    } catch (error) {
      console.error("Login Error:", error); // Debugging
      alert("Login failed: " + error.message);
    }
  };

  const googleProvider = new GoogleAuthProvider();

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem("user", JSON.stringify(result.user)); // Store user session
      alert("Logged in with Google!");
      navigate("/foodlist"); // Redirect to food list page
    } catch (error) {
      alert("Google login failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>LOGIN</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="remember-me">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember me</label>
        </div>
        <button type="submit" className="login-btn">LOGIN</button>
      </form>
      <p>Or login with</p>
      <div className="social-login">
        <button className="social-btn google" onClick={loginWithGoogle}>Google</button>
      </div>
    </div>
  );
};

export default LoginForm;
