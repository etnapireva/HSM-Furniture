// src/Pages/LoginSignup.jsx
import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import { backend_url } from "../App";
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

  const login = async () => {
    if (!formData.email || !formData.password) {
      alert("Email and password are required");
      return;
    }
    try {
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
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.errors || "Login failed");
      }
      // Backend returns { success: true, accessToken }
      localStorage.setItem("auth-token", data.accessToken);
      window.location.replace("/");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message);
    }
  };

  const signup = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      alert("All fields are required");
      return;
    }
    try {
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
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.errors || "Signup failed");
      }
      localStorage.setItem("auth-token", data.accessToken);
      window.location.replace("/");
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{mode}</h1>
        <div className="loginsignup-fields">
          {mode === "Sign Up" && (
            <input
              type="text"
              placeholder="Your name"
              name="username"
              value={formData.username}
              onChange={changeHandler}
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            name="email"
            value={formData.email}
            onChange={changeHandler}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={changeHandler}
          />
        </div>

        <button
          onClick={() => (mode === "Login" ? login() : signup())}
        >
          Continue
        </button>

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
