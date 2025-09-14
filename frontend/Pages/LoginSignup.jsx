// src/Pages/LoginSignup.jsx
import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import { backend_url } from "../App";
import { setTokens } from "../utils/authUtils";

export default function LoginSignup() {
  const [mode, setMode] = useState("Login"); // "Login" or "Sign Up"
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    setFormData((fd) => ({ ...fd, [e.target.name]: e.target.value }));
  };

  const login = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!formData.email || !formData.password) {
      alert("Email and password are required");
      return;
    }
    try {
      console.log("🔄 Attempting login with:", { email: formData.email, password: "***" });
      
      const resp = await fetch(`${backend_url}/login`, {
        method: "POST",
        headers: {
          "Accept":       "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email:    formData.email,
          password: formData.password,
        }),
      });
      
      console.log("📡 Response status:", resp.status);
      console.log("📡 Response headers:", resp.headers);
      
      const text = await resp.text();
      console.log("📡 Raw response text:", text);
      
      let data; try { data = JSON.parse(text); } catch (e) { 
        console.error("❌ Failed to parse JSON:", e);
        data = null; 
      }
      
      if (!resp.ok) {
        const msg = (data && (data.errors || data.error)) || text || "Login failed";
        throw new Error(msg);
      }
      
      // Debug: Log the response data
      console.log("✅ Login response:", data);
      console.log("🔑 Access token:", data.accessToken ? "Present" : "Missing");
      console.log("🔄 Refresh token:", data.refreshToken ? "Present" : "Missing");
      
      if (!data.accessToken || !data.refreshToken) {
        console.error("❌ Missing tokens in response!");
        console.error("Response keys:", Object.keys(data));
        throw new Error("Server response missing required tokens");
      }
      
      // Store both access and refresh tokens
      setTokens(data.accessToken, data.refreshToken);
      
      // Dispatch custom event to notify components of token update
      window.dispatchEvent(new CustomEvent('tokenUpdated'));
      
      window.location.replace("/");
    } catch (err) {
      console.error("❌ Login error:", err);
      alert(err.message);
    }
  };

  const signup = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!formData.username || !formData.email || !formData.password) {
      alert("All fields are required");
      return;
    }
    try {
      console.log("🔄 Attempting signup with:", { username: formData.username, email: formData.email, password: "***" });
      
      const resp = await fetch(`${backend_url}/signup`, {
        method: "POST",
        headers: {
          "Accept":       "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email:    formData.email,
          password: formData.password,
        }),
      });
      
      console.log("📡 Response status:", resp.status);
      console.log("📡 Response headers:", resp.headers);
      
      const text = await resp.text();
      console.log("📡 Raw response text:", text);
      
      let data; try { data = JSON.parse(text); } catch (e) { 
        console.error("❌ Failed to parse JSON:", e);
        data = null; 
      }
      
      if (!resp.ok) {
        const msg = (data && (data.errors || data.error)) || text || "Signup failed";
        throw new Error(msg);
      }
      
      // Debug: Log the response data
      console.log("✅ Signup response:", data);
      console.log("🔑 Access token:", data.accessToken ? "Present" : "Missing");
      console.log("🔄 Refresh token:", data.refreshToken ? "Present" : "Missing");
      
      if (!data.accessToken || !data.refreshToken) {
        console.error("❌ Missing tokens in response!");
        console.error("Response keys:", Object.keys(data));
        throw new Error("Server response missing required tokens");
      }
      
      // Store both access and refresh tokens
      setTokens(data.accessToken, data.refreshToken);
      window.location.replace("/");
    } catch (err) {
      console.error("❌ Signup error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{mode}</h1>
        <form onSubmit={mode === "Login" ? login : signup}>
          <div className="loginsignup-fields">
            {mode === "Sign Up" && (
              <input
                type="text"
                placeholder="Your name"
                name="username"
                value={formData.username}
                onChange={changeHandler}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              name="email"
              value={formData.email}
              onChange={changeHandler}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={changeHandler}
              required
            />
          </div>

          <button type="submit">
            Continue
          </button>
        </form>

        {mode === "Login" ? (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span onClick={() => setMode("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span onClick={() => setMode("Login")}>Login here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" id="agree" required />
          <label htmlFor="agree">
            By continuing, I agree to the terms of use & privacy policy.
          </label>
        </div>
      </div>
    </div>
  );
}
