import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdLocalHospital } from "react-icons/md";
import { getCurrentUser, logout } from "../systemStore";
import { authApi } from "../api";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Departments", to: "/departments" },
  { label: "Doctors", to: "/doctors" },
  { label: "Patients", to: "/patients" },
  { label: "Appointments", to: "/appointments" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const refreshUser = () => setUser(getCurrentUser());
    window.addEventListener("storage", refreshUser);
    window.addEventListener("lifeline_user_updated", refreshUser);
    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("lifeline_user_updated", refreshUser);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpen(false);
        setProfileOpen(false);
      }
    };

    if (open || profileOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [open, profileOpen]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Clear the client session even if the token is already expired.
    }
    logout();
    setUser(null);
    setProfileOpen(false);
    setOpen(false);
    navigate("/signup");
  };

  const initials = (name = "Patient") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl" ref={navRef}>
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-2 sm:px-3 md:px-4 py-4">
        <div className="flex items-center gap-3 text-2xl font-bold text-pink-600">
          <MdLocalHospital className="inline" />
          <span>HealthNest</span>
        </div>

        <div className="flex items-center justify-end gap-2">
          {user && (
            <div className="relative md:hidden">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setProfileOpen((current) => !current);
                }}
                className="inline-flex h-8 w-8 mt-4 items-center justify-center overflow-hidden rounded-full bg-pink-600 text-xs font-bold text-white shadow-sm transition hover:ring-4 hover:ring-pink-100"
                aria-label="Open mobile profile menu"
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  initials(user.name)
                )}
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 sm:px-4 py-3">
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <NavLink
                    to="/dashboard"
                    onClick={() => {
                      setProfileOpen(false);
                      setOpen(false);
                    }}
                    className="block rounded-xl px-3 sm:px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/my-appointments"
                    onClick={() => {
                      setProfileOpen(false);
                      setOpen(false);
                    }}
                    className="block rounded-xl px-3 sm:px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    My Appointments
                  </NavLink>
                  <NavLink
                    to="/profile"
                    onClick={() => {
                      setProfileOpen(false);
                      setOpen(false);
                    }}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Profile Settings
                  </NavLink>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="block w-full rounded-xl px-3 sm:px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={() => {
              setProfileOpen(false);
              setOpen((current) => !current);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-pink-500 md:hidden"
            aria-label="Toggle navigation menu"
          >
            <span className="text-lg">☰</span>
          </button>
        </div>

        <div className={`w-full md:flex md:w-auto ${open ? "block" : "hidden"}`}>
          <div className="flex max-h-[calc(100vh-88px)] flex-col gap-5 overflow-y-auto rounded-3xl bg-white/95 p-3 sm:p-4 shadow-lg transition-all duration-200 md:mt-0 md:flex-row md:items-center md:bg-transparent md:p-0 md:shadow-none md:overflow-visible">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-base font-medium transition hover:text-pink-600 ${
                      isActive ? "text-pink-700 underline" : "text-slate-700"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="flex flex-col gap-4 pt-3 md:ml-auto md:flex-row md:pt-0">
              {!user ? (
                <NavLink
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-[20px] bg-pink-600 px-3 sm:px-4 py-2 text-center text-sm text-white shadow-sm transition hover:bg-pink-700"
                >
                  Login
                </NavLink>
              ) : (
                <div className="relative hidden md:block">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((current) => !current)}
                    className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-pink-600 text-sm font-bold text-white shadow-sm transition hover:ring-4 hover:ring-pink-100"
                    aria-label="Open profile menu"
                  >
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      initials(user.name)
                    )}
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                      <div className="border-b border-slate-100 px-3 sm:px-4 py-3">
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">{user.email}</p>
                      </div>
                      <NavLink
                        to="/dashboard"
                        onClick={() => {
                          setOpen(false);
                          setProfileOpen(false);
                        }}
                        className="block rounded-xl px-3 sm:px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Dashboard
                      </NavLink>
                      <NavLink
                        to="/my-appointments"
                        onClick={() => {
                          setOpen(false);
                          setProfileOpen(false);
                        }}
                        className="block rounded-xl px-3 sm:px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        My Appointments
                      </NavLink>
                      <NavLink
                        to="/profile"
                        onClick={() => {
                          setOpen(false);
                          setProfileOpen(false);
                        }}
                        className="block rounded-xl px-3 sm:px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Profile Settings
                      </NavLink>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}