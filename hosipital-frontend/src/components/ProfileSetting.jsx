import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getCurrentUser, setCurrentUser } from "../systemStore";
import { profileApi } from "../api";

const initials = (name = "Patient") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [user] = useState(() => getCurrentUser());
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    profileImage: user?.profileImage || "",
  });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileStatus, setProfileStatus] = useState({ message: "", type: "" });
  const [securityStatus, setSecurityStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(Boolean(user));

  const formatStatusMessage = (input) => {
    const message = input?.message || input || "";
    if (!message) return "Something went wrong. Please try again.";
    const cleaned = String(message).replace(/<[^>]*>/g, "").trim();
    return cleaned || "The server returned an unexpected response. Please try again.";
  };

  const optimizeImage = async (file) => {
    if (!file || !file.type.startsWith("image/")) throw new Error("Please select a valid image.");
    // Always resize & compress — even small files get resized for consistency
    const imageBitmap = await createImageBitmap(file);
    const maxDimension = 400; // profile pic — 400px is plenty
    const scale = Math.min(1, maxDimension / imageBitmap.width, maxDimension / imageBitmap.height);
    const width = Math.round(imageBitmap.width * scale);
    const height = Math.round(imageBitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    canvas.getContext("2d").drawImage(imageBitmap, 0, 0, width, height);
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error("Unable to process image.")); return; }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }, "image/jpeg", 0.65); // 0.65 quality — sharp enough, small enough
    });
  };

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    profileApi.get()
      .then((data) => {
        if (!mounted) return;
        setCurrentUser(data.user);
        setProfile({ name: data.user.name || "", email: data.user.email || "", phone: data.user.phone || "", address: data.user.address || "", profileImage: data.user.profileImage || "" });
      })
      .catch((error) => setProfileStatus({ message: formatStatusMessage(error.message), type: "error" }))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen pt-20 sm:pt-24" style={{ background: "linear-gradient(135deg, #fff0f6 0%, #fce4ec 40%, #fdf2f8 100%)" }}>
        <Navbar />
        <main className="mx-auto max-w-3xl px-3 py-8 sm:px-4 sm:py-12">
          <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center" style={{ background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(249,168,212,0.45)", boxShadow: "0 8px 32px rgba(236,72,153,0.1)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🔒</div>
            <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: "#831843" }}>Please login to edit your profile</h1>
            <p className="mt-3 text-sm" style={{ color: "#9d174d", fontFamily: "sans-serif" }}>Sign in to manage your HealthNest patient account.</p>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="mt-6 rounded-full px-8 py-3 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #f43f8e, #db2777)", boxShadow: "0 4px 18px rgba(190,24,93,0.28)" }}
            >
              Login to Continue
            </button>
          </div>
        </main>
      </div>
    );
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((curr) => ({ ...curr, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimized = await optimizeImage(file);
      setProfile((curr) => ({ ...curr, profileImage: optimized }));
      setProfileStatus({ message: "✓ Image ready — click Save Profile to apply.", type: "success" });
    } catch (error) {
      setProfileStatus({ message: formatStatusMessage(error.message), type: "error" });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileStatus({ message: "", type: "" });
    try {
      const data = await profileApi.update(profile);
      setCurrentUser(data.user);
      setProfileStatus({ message: "✓ Profile updated successfully.", type: "success" });
    } catch (error) {
      setProfileStatus({ message: formatStatusMessage(error.message), type: "error" });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSecurityStatus({ message: "", type: "" });
    if (passwords.newPassword.length < 8) { setSecurityStatus({ message: "New password must be at least 8 characters.", type: "error" }); return; }
    if (passwords.newPassword !== passwords.confirmPassword) { setSecurityStatus({ message: "New password and confirmation do not match.", type: "error" }); return; }
    try {
      const data = await profileApi.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSecurityStatus({ message: data.message, type: "success" });
    } catch (error) {
      setSecurityStatus({ message: formatStatusMessage(error.message), type: "error" });
    }
  };

  const inputCls = {
    width: "100%",
    borderRadius: "14px",
    border: "1.5px solid rgba(249,168,212,0.55)",
    background: "#fdf2f8",
    padding: "12px 16px",
    fontSize: "0.92rem",
    color: "#831843",
    outline: "none",
    marginTop: "8px",
    transition: "border 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
    minHeight: "48px",
    fontFamily: "sans-serif",
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24" style={{ background: "linear-gradient(135deg, #fff0f6 0%, #fce4ec 40%, #fdf2f8 100%)" }}>
      <Navbar />
      <main className="mx-auto max-w-6xl px-3 pb-8 pt-4 sm:px-4 sm:py-10">

        {/* Header */}
        <section className="rounded-2xl sm:rounded-[28px] p-5 sm:p-8 mb-4 sm:mb-6" style={{ background: "rgba(255,255,255,0.82)", border: "1.5px solid rgba(249,168,212,0.45)", boxShadow: "0 4px 24px rgba(236,72,153,0.09)" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#ec4899", fontFamily: "sans-serif" }}>Profile Settings</p>
          <h1 className="mt-3 text-2xl sm:text-4xl font-bold" style={{ color: "#831843" }}>Manage your patient profile</h1>
          <p className="mt-3 text-sm sm:text-base" style={{ color: "#9d174d", fontFamily: "sans-serif", lineHeight: 1.65, maxWidth: "560px" }}>
            Update your personal details, profile photo, and keep your account secure — all in one place.
          </p>
        </section>

        {loading && (
          <div className="mt-4 rounded-2xl p-5 text-sm sm:mt-6 sm:p-6" style={{ background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(249,168,212,0.3)", color: "#9d174d", fontFamily: "sans-serif" }}>
            Loading your profile…
          </div>
        )}

        {/* Profile + Info Grid */}
        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[0.8fr_1.2fr]">

          {/* Sidebar */}
          <aside className="overflow-hidden rounded-2xl sm:rounded-[28px]" style={{ background: "linear-gradient(160deg, #4a0020 0%, #831843 55%, #9d174d 100%)", boxShadow: "0 16px 48px rgba(74,0,32,0.35)" }}>
            <div className="p-5 sm:p-8">
              <div className="flex items-center gap-4 sm:gap-6 lg:flex-col lg:text-center">
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt={profile.name} className="h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 object-cover" style={{ borderRadius: "24px", boxShadow: "0 8px 28px rgba(0,0,0,0.3)" }} />
                  ) : (
                    <div className="flex h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 items-center justify-center text-3xl sm:text-4xl font-bold" style={{ borderRadius: "24px", background: "linear-gradient(135deg, #f43f8e, #db2777)", boxShadow: "0 8px 28px rgba(244,63,142,0.4)", color: "#fff" }}>
                      {initials(profile.name)}
                    </div>
                  )}
                  <label className="absolute -bottom-2 left-1/2 -translate-x-1/2 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold sm:hidden" style={{ background: "rgba(255,255,255,0.9)", color: "#831843" }}>
                    Change
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
                <div className="min-w-0 flex-1">
                  <label className="hidden cursor-pointer rounded-full px-5 py-2 text-sm font-semibold sm:inline-flex" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" }}>
                    📷 Change Photo
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <h2 className="break-words text-xl font-bold leading-tight text-white sm:mt-5 sm:text-2xl">{profile.name || "Your Name"}</h2>
                  <p className="mt-2 break-all text-sm leading-5 sm:text-base" style={{ color: "rgba(255,255,255,0.65)" }}>{profile.email}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 text-sm">
                {[["📞 Phone", profile.phone || "Not added"], ["📍 Address", profile.address || "Not added"]].map(([label, val]) => (
                  <div key={label} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}>
                    <p style={{ fontSize: "0.65rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f9a8d4", marginBottom: "4px" }}>{label}</p>
                    <p className="font-semibold text-white break-words line-clamp-3">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Personal Info Form */}
          <section className="rounded-2xl sm:rounded-[28px] p-5 sm:p-8" style={{ background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(249,168,212,0.45)", boxShadow: "0 4px 24px rgba(236,72,153,0.09)" }}>
            <h2 className="text-xl font-bold sm:text-2xl" style={{ color: "#831843" }}>Personal Information</h2>
            <p className="mt-1 text-sm" style={{ color: "#9d174d", fontFamily: "sans-serif" }}>Update the details used for your appointments and records.</p>

            <form onSubmit={handleProfileSubmit} className="mt-5 sm:mt-6">
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                {[
                  { name: "name", label: "Full Name", type: "text", autoComplete: "name", placeholder: "Enter your full name" },
                  { name: "email", label: "Email Address", type: "email", autoComplete: "email", placeholder: "name@example.com" },
                  { name: "phone", label: "Phone Number", type: "tel", autoComplete: "tel", placeholder: "+91 98765 43210" },
                ].map((field) => (
                  <label key={field.name} className="block">
                    <span className="text-sm font-semibold" style={{ color: "#831843", fontFamily: "sans-serif" }}>{field.label}</span>
                    <input
                      name={field.name}
                      type={field.type}
                      value={profile[field.name]}
                      onChange={handleProfileChange}
                      autoComplete={field.autoComplete}
                      placeholder={field.placeholder}
                      style={inputCls}
                    />
                  </label>
                ))}
                <label className="block sm:col-span-2">
                  <span className="text-sm font-semibold" style={{ color: "#831843", fontFamily: "sans-serif" }}>Address</span>
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleProfileChange}
                    rows={4}
                    autoComplete="street-address"
                    placeholder="Enter your full address"
                    style={{ ...inputCls, minHeight: "100px", resize: "vertical" }}
                  />
                </label>
              </div>

              <div className="mt-5 sm:col-span-2">
                <button type="submit" className="rounded-full px-8 py-3 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #f43f8e, #db2777)", boxShadow: "0 4px 18px rgba(190,24,93,0.28)", fontFamily: "sans-serif" }}>
                  Save Profile
                </button>
                {profileStatus.message && (
                  <p className="mt-4 rounded-xl border px-4 py-3 text-sm font-semibold" style={{ border: profileStatus.type === "error" ? "1.5px solid #fca5a5" : "1.5px solid #a7f3d0", background: profileStatus.type === "error" ? "#fff0f0" : "#f0fdf4", color: profileStatus.type === "error" ? "#b91c1c" : "#065f46", fontFamily: "sans-serif" }} aria-live="polite">
                    {profileStatus.message}
                  </p>
                )}
              </div>
            </form>
          </section>
        </div>

        {/* Change Password */}
        <section className="mt-4 sm:mt-6">
          <div className="rounded-2xl sm:rounded-[28px] p-5 sm:p-8" style={{ background: "rgba(255,255,255,0.85)", border: "1.5px solid rgba(249,168,212,0.45)", boxShadow: "0 4px 24px rgba(236,72,153,0.09)" }}>
            <h2 className="text-xl font-bold sm:text-2xl" style={{ color: "#831843" }}>Change Password</h2>
            <p className="mt-1 text-sm" style={{ color: "#9d174d", fontFamily: "sans-serif" }}>Use a strong password with at least 8 characters to keep your account secure.</p>

            <form onSubmit={handlePasswordSubmit} className="mt-5 sm:mt-6 grid gap-4 md:grid-cols-3 md:gap-5">
              {[
                { name: "currentPassword", label: "Current Password", placeholder: "Enter current password" },
                { name: "newPassword", label: "New Password", placeholder: "Min. 8 characters" },
                { name: "confirmPassword", label: "Confirm New Password", placeholder: "Re-enter new password" },
              ].map((field) => (
                <label key={field.name} className="block">
                  <span className="text-sm font-semibold" style={{ color: "#831843", fontFamily: "sans-serif" }}>{field.label}</span>
                  <input
                    name={field.name}
                    type="password"
                    value={passwords[field.name]}
                    onChange={(e) => setPasswords((curr) => ({ ...curr, [field.name]: e.target.value }))}
                    autoComplete={field.name === "currentPassword" ? "current-password" : "new-password"}
                    placeholder={field.placeholder}
                    style={inputCls}
                  />
                </label>
              ))}

              <div className="md:col-span-3">
                <button type="submit" className="rounded-full px-8 py-3 text-sm font-semibold text-white" style={{ background: "linear-gradient(160deg, #4a0020, #831843)", boxShadow: "0 4px 18px rgba(74,0,32,0.3)", fontFamily: "sans-serif" }}>
                  Update Password
                </button>
                {securityStatus.message && (
                  <p className="mt-4 rounded-xl border px-4 py-3 text-sm font-semibold leading-6 sm:rounded-2xl" style={{ border: securityStatus.type === "error" ? "1.5px solid #fca5a5" : "1.5px solid #a7f3d0", background: securityStatus.type === "error" ? "#fff0f0" : "#f0fdf4", color: securityStatus.type === "error" ? "#b91c1c" : "#065f46", fontFamily: "sans-serif" }} aria-live="polite">
                    {securityStatus.message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>

      </main>
    </div>
  );
}