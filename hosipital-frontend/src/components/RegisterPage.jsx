import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { authApi } from "../api";
import { setSession } from "../systemStore";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (!accepted) {
      setError("Please agree to the service and privacy policy.");
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.register({ name, email, password, phone });
      setSession(data);
      setStatus("Account created! Redirecting...");
      const redirectPath = localStorage.getItem("healthnest_post_login_redirect") || "/dashboard";
      localStorage.removeItem("healthnest_post_login_redirect");
      setTimeout(() => navigate(redirectPath), 900);
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
    transition: "border 0.2s, box-shadow 0.2s",
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
            className="space-y-6 rounded-[40px] p-10 text-white shadow-2xl"
            style={{ background: "linear-gradient(135deg, #f43f8e 0%, #ec4899 50%, #db2777 100%)", position: "relative", overflow: "hidden" }}
          >
            {/* Decorative blobs */}
            <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -40, left: "20%", width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

            <p style={{ fontSize: "0.72rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#fce7f3" }}>
              Create your account
            </p>
            <h1 className="text-4xl font-bold leading-tight" style={{ position: "relative" }}>
              Join HealthNest today.
            </h1>
            <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "rgba(255,255,255,0.88)", fontFamily: "sans-serif", maxWidth: "400px", position: "relative" }}>
              Register to book appointments, view medical records, and stay connected with your care team — all in one place.
            </p>

            <div style={{ borderRadius: "20px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "22px 24px", position: "relative" }}>
              <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "14px" }}>Already have an account?</p>
              <Link
                to="/signup"
                style={{ display: "inline-flex", borderRadius: "999px", background: "#fff", padding: "10px 24px", fontSize: "0.85rem", fontWeight: 700, color: "#db2777", textDecoration: "none", fontFamily: "sans-serif", transition: "opacity 0.2s" }}
              >
                Sign in instead →
              </Link>
            </div>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", position: "relative" }}>
              {["Instant appointment booking", "Secure medical records access", "24/7 patient support"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ width: "20px", height: "20px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: "#fff", fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.88)", fontFamily: "sans-serif" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form */}
          <div
            className="rounded-[40px] p-8 sm:p-10 shadow-2xl"
            style={{ background: "rgba(255,255,255,0.88)", border: "1.5px solid rgba(249,168,212,0.45)" }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#831843" }}>Create your patient profile</h2>
            <p className="mt-2 text-sm" style={{ color: "#9d174d", fontFamily: "sans-serif" }}>
              Fill in your details to get started with HealthNest.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {[
                { label: "Full Name", type: "text", value: name, setter: setName, placeholder: "Enter your full name" },
                { label: "Phone Number", type: "tel", value: phone, setter: setPhone, placeholder: "+91 98765 43210" },
                { label: "Email Address", type: "email", value: email, setter: setEmail, placeholder: "you@gmail.com" },
                { label: "Password", type: "password", value: password, setter: setPassword, placeholder: "At least 8 characters" },
              ].map((field) => (
                <div key={field.label}>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#831843", fontFamily: "sans-serif", marginBottom: "6px" }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.placeholder}
                    required={field.type !== "tel"}
                    style={inputStyle}
                  />
                </div>
              ))}

              {/* Checkbox */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  style={{ marginTop: "3px", accentColor: "#ec4899", width: "16px", height: "16px", flexShrink: 0 }}
                />
                <p style={{ fontSize: "0.82rem", color: "#9d174d", fontFamily: "sans-serif", lineHeight: 1.6 }}>
                  I agree to the{" "}
                  <button type="button" style={{ color: "#db2777", fontWeight: 700, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "inherit" }}>Service Agreement</button>
                  {" "}and{" "}
                  <button type="button" style={{ color: "#db2777", fontWeight: 700, textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontSize: "inherit" }}>Privacy Policy</button>.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", borderRadius: "999px", background: loading ? "rgba(236,72,153,0.5)" : "linear-gradient(135deg, #f43f8e, #db2777)", color: "#fff", border: "none", padding: "14px 24px", fontSize: "0.95rem", fontWeight: 700, fontFamily: "sans-serif", cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 24px rgba(190,24,93,0.28)", transition: "all 0.2s" }}
              >
                {loading ? "Creating account…" : "Create Account →"}
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
              Already have an account?{" "}
              <Link to="/signup" style={{ fontWeight: 700, color: "#db2777", textDecoration: "underline" }}>
                Login here
              </Link>
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}