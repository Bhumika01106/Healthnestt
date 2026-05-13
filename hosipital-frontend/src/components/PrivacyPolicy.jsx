import React from "react";
import Navbar from "./Navbar";
import { BiShieldQuarter, BiLockAlt, BiCalendarCheck, BiCookie } from "react-icons/bi";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-24 text-slate-900" style={{ background: "linear-gradient(135deg, #fff0f6 0%, #fce4ec 40%, #fdf2f8 100%)" }}>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-14">

        {/* Hero Banner */}
        <section
          className="rounded-[32px] px-7 py-12 text-white shadow-2xl sm:px-10 sm:py-16"
          style={{ background: "linear-gradient(135deg, #f43f8e 0%, #ec4899 50%, #db2777 100%)", position: "relative", overflow: "hidden" }}
        >
          <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.07)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: "35%", width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
          <p className="text-sm uppercase tracking-[0.32em]" style={{ color: "#fce7f3" }}>Privacy Policy</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">HealthNest patient privacy and data protection</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8" style={{ color: "rgba(255,255,255,0.88)" }}>
            We are committed to protecting your medical information, appointment details, and online interactions with the highest standard of security and transparency.
          </p>
        </section>

        {/* Cards Grid */}
        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          {[
            {
              icon: <BiShieldQuarter style={{ fontSize: "2rem", color: "#ec4899" }} />,
              title: "Patient data protection",
              description: "All patient records are stored using industry-grade safeguards. We limit access to care providers and support staff only when needed for treatment.",
            },
            {
              icon: <BiLockAlt style={{ fontSize: "2rem", color: "#ec4899" }} />,
              title: "Medical privacy",
              description: "Your medical history, test results, and consultation notes are confidential. We never share health details without your consent except as required by law.",
            },
            {
              icon: <BiCalendarCheck style={{ fontSize: "2rem", color: "#ec4899" }} />,
              title: "Appointment information",
              description: "Appointment times, reminders, and follow-up records are securely managed. We use this data only to support your care journey and booking experience.",
            },
            {
              icon: <BiCookie style={{ fontSize: "2rem", color: "#ec4899" }} />,
              title: "Cookies & security",
              description: "Our website uses cookies to improve usability and protect against fraud. Personal data is encrypted in transit and stored securely.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-[28px] p-8"
              style={{ background: "rgba(255,255,255,0.82)", border: "1.5px solid rgba(249,168,212,0.45)", boxShadow: "0 4px 24px rgba(236,72,153,0.09)", transition: "transform 0.2s, box-shadow 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(236,72,153,0.18)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(236,72,153,0.09)"; }}
            >
              <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "linear-gradient(135deg, #fce7f3, #fbcfe8)", border: "1px solid rgba(249,168,212,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {item.icon}
              </div>
              <h2 className="mt-6 text-2xl font-semibold" style={{ color: "#831843" }}>{item.title}</h2>
              <p className="mt-4 text-sm leading-7" style={{ color: "#9d174d" }}>{item.description}</p>
            </article>
          ))}
        </section>

        {/* Contact + Info Section */}
        <section
          className="mt-12 rounded-[32px] p-8 sm:p-10"
          style={{ background: "rgba(255,255,255,0.82)", border: "1.5px solid rgba(249,168,212,0.45)", boxShadow: "0 4px 24px rgba(236,72,153,0.09)" }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em]" style={{ color: "#ec4899" }}>Contact information</p>
              <h2 className="mt-4 text-3xl font-bold" style={{ color: "#831843" }}>Privacy questions? We're here to help.</h2>
            </div>
            <div className="rounded-3xl p-6" style={{ background: "linear-gradient(135deg, #fdf2f8, #fce7f3)", border: "1.5px solid rgba(249,168,212,0.4)" }}>
              <p className="text-sm font-semibold uppercase tracking-[0.24em]" style={{ color: "#be185d" }}>HealthNest</p>
              <p className="mt-4 text-lg font-semibold" style={{ color: "#831843" }}>healthnest@gmail.com</p>
              <p className="mt-2 text-sm" style={{ color: "#9d174d" }}>+91 9876543210</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              { title: "Data access", desc: "You can request a copy of your medical or appointment records at any time." },
              { title: "Consent", desc: "We only collect information necessary to provide care and deliver support services." },
              { title: "Account security", desc: "Strong authentication and encrypted communication protect your patient profile." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl p-6"
                style={{ background: "linear-gradient(135deg, #fdf2f8, #fce7f3)", border: "1.5px solid rgba(249,168,212,0.35)" }}
              >
                <h3 className="text-lg font-semibold" style={{ color: "#831843" }}>{item.title}</h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "#9d174d" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}