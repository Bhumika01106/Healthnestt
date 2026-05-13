import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { authApi } from "../api";
import { setSession } from "../systemStore";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setLoading(true);

    try {
      const data = await authApi.login({ email, password });
      setSession(data);
      setStatus("Login successful! Redirecting...");
      const redirectPath = localStorage.getItem("healthnest_post_login_redirect") || "/dashboard";
      localStorage.removeItem("healthnest_post_login_redirect");
      setTimeout(() => navigate(redirectPath), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    borderRadius: "14px",
    border: "1.5px solid rgba(249,168,212,0.6)",
    background: "#fdf2f8",
    padding: "12px 16px",
    fontSize: "0.92rem",
    color: "#831843",
    outline: "none",
    transition: "border 0.2s",
    boxSizing: "border-box",
    fontFamily: "sans-serif",
  };

  return (
    <div
      className="min-h-screen text-slate-900"
      style={{ background: "linear-gradient(135deg, #fff0f6 0%, #fce4ec 40%, #fdf2f8 100%)" }}
    >
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

          {/* Left Panel */}
          <div
            className="space-y-6 rounded-[40px] p-10 sm:p-12 text-white shadow-2xl"
            style={{ background: "linear-gradient(135deg, #f43f8e 0%, #ec4899 50%, #db2777 100%)" }}
          >
            <p style={{ fontSize: "0.72rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#fce7f3" }}>
              Patient Login
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Welcome back to HealthNest.
            </h1>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "rgba(255,255,255,0.88)", fontFamily: "sans-serif", maxWidth: "400px" }}>
              Access your appointments, medical records, and personalized care dashboard with a secure login.
            </p>
            <div style={{ borderRadius: "20px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "22px 24px" }}>
              <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "14px" }}>Need an account?</p>
              <Link
                to="/register"
                style={{ display: "inline-flex", borderRadius: "999px", background: "#fff", padding: "10px 24px", fontSize: "0.85rem", fontWeight: 700, color: "#db2777", textDecoration: "none", fontFamily: "sans-serif" }}
              >
                Create one now →
              </Link>
            </div>
          </div>

          {/* Right Form */}
          <div
            className="rounded-[40px] p-8 sm:p-10 shadow-2xl"
            style={{ background: "rgba(255,255,255,0.88)", border: "1.5px solid rgba(249,168,212,0.45)" }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#831843" }}>Login to your account</h2>
            <p className="mt-2 text-sm" style={{ color: "#9d174d", fontFamily: "sans-serif" }}>
              Enter your details to continue to the patient portal.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#831843", fontFamily: "sans-serif", marginBottom: "6px" }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#831843", fontFamily: "sans-serif", marginBottom: "6px" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", borderRadius: "999px", background: loading ? "rgba(236,72,153,0.5)" : "linear-gradient(135deg, #f43f8e, #db2777)", color: "#fff", border: "none", padding: "14px 24px", fontSize: "0.95rem", fontWeight: 700, fontFamily: "sans-serif", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 24px rgba(190,24,93,0.28)", transition: "all 0.2s" }}
              >
                {loading ? "Logging in…" : "Login →"}
              </button>
            </form>

            {status && (
              <p style={{ marginTop: "16px", textAlign: "center", fontSize: "0.88rem", fontFamily: "sans-serif", color: "#065f46", background: "#f0fdf4", border: "1.5px solid #a7f3d0", borderRadius: "12px", padding: "10px 16px" }}>
                ✓ {status}
              </p>
            )}
            {error && (
              <p style={{ marginTop: "16px", textAlign: "center", fontSize: "0.88rem", fontFamily: "sans-serif", color: "#b91c1c", background: "#fff0f0", border: "1.5px solid #fca5a5", borderRadius: "12px", padding: "10px 16px" }}>
                {error}
              </p>
            )}

            <p style={{ marginTop: "20px", textAlign: "center", fontSize: "0.85rem", color: "#9d174d", fontFamily: "sans-serif" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ fontWeight: 700, color: "#db2777", textDecoration: "underline" }}>
                Register here
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}