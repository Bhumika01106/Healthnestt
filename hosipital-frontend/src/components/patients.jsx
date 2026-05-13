import React from "react";
import Navbar from "./Navbar";

const features = [
  {
    title: "Easy Scheduling",
    icon: "🗓️",
    detail: "Reserve visits online, choose the provider you want, and receive confirmation instantly.",
  },
  {
    title: "Digital Records",
    icon: "📋",
    detail: "View your test results, prescriptions, and medical history anytime in a secure portal.",
  },
  {
    title: "24/7 Support",
    icon: "💬",
    detail: "Access care advice and helpful resources from our support staff whenever you need them.",
  },
];

export default function Patients() {
  return (
    <div
      className="min-h-screen pt-24 text-slate-900"
      style={{
        background: "linear-gradient(135deg, #fff0f6 0%, #fce4ec 40%, #fdf2f8 100%)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <Navbar />

      {/* Decorative blobs */}
      <div
        style={{
          position: "fixed",
          top: "-120px",
          right: "-120px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(circle, #f9a8d4 0%, #fbcfe8 60%, transparent 100%)",
          opacity: 0.35,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-100px",
          left: "-80px",
          width: "340px",
          height: "340px",
          borderRadius: "50%",
          background: "radial-gradient(, #f472b6 0%, #fbcfe8 70%, transparent 100%)",
          opacity: 0.25,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <main
        className="max-w-7xl mx-auto px-4 py-10"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Hero Section */}
        <section
          className="grid gap-10 lg:grid-cols-2 items-center rounded-3xl p-10"
          style={{
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 48px 0 rgba(244,114,182,0.15), 0 2px 16px rgba(0,0,0,0.06)",
            border: "1.5px solid rgba(249,168,212,0.35)",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                background: "linear-gradient(90deg, #ec4899, #f9a8d4)",
                color: "#fff",
                borderRadius: "999px",
                padding: "4px 18px",
                fontSize: "0.75rem",
                fontFamily: "'Trebuchet MS', sans-serif",
                letterSpacing: "0.18em",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "18px",
              }}
            >
              Patient Care
            </span>

            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 800,
                lineHeight: 1.12,
                color: "#831843",
                letterSpacing: "-0.02em",
                marginBottom: "20px",
              }}
            >
              Resources designed for your{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #ec4899, #db2777)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                comfort
              </span>{" "}
              &amp; confidence.
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.75,
                color: "#9d174d",
                marginBottom: "32px",
                fontFamily: "'Trebuchet MS', sans-serif",
                fontWeight: 400,
              }}
            >
              From appointment reminders to medical records and support programs,
              we make it easy for patients and families to stay informed and feel supported.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Patient Portal",
                  desc: "Manage appointments, access test results, and keep track of your care plan.",
                  icon: "🏥",
                },
                {
                  title: "Insurance Support",
                  desc: "One-on-one guidance for billing, claims, and coverage questions.",
                  icon: "🛡️",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    borderRadius: "20px",
                    background: "linear-gradient(135deg, #fdf2f8 60%, #fce7f3 100%)",
                    border: "1.5px solid #f9a8d4",
                    padding: "22px 20px",
                    boxShadow: "0 2px 12px rgba(236,72,153,0.08)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 28px rgba(236,72,153,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(236,72,153,0.08)";
                  }}
                >
                  <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{card.icon}</div>
                  <h2
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#be185d",
                      marginBottom: "8px",
                    }}
                  >
                    {card.title}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.92rem",
                      color: "#9d174d",
                      fontFamily: "'Trebuchet MS', sans-serif",
                      lineHeight: 1.6,
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div
            style={{
              borderRadius: "28px",
              overflow: "hidden",
              boxShadow: "0 12px 48px rgba(236,72,153,0.18)",
              border: "2px solid rgba(249,168,212,0.4)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, transparent 60%, rgba(190,24,93,0.25) 100%)",
                zIndex: 1,
              }}
            />
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80"
              alt="Compassionate patient care"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          {features.map((item, i) => (
            <div
              key={item.title}
              style={{
                borderRadius: "24px",
                background: "rgba(255,255,255,0.78)",
                backdropFilter: "blur(12px)",
                border: "1.5px solid rgba(249,168,212,0.3)",
                padding: "34px 28px",
                boxShadow: "0 4px 24px rgba(236,72,153,0.09)",
                transition: "transform 0.25s, box-shadow 0.25s",
                cursor: "default",
                animationDelay: `${i * 0.12}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.01)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(236,72,153,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(236,72,153,0.09)";
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #fce7f3, #fbcfe8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                  marginBottom: "18px",
                  border: "1px solid #f9a8d4",
                }}
              >
                {item.icon}
              </div>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#831843",
                  marginBottom: "12px",
                  letterSpacing: "-0.01em",
                }}
              >
                {item.title}
              </h2>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "#9d174d",
                  fontFamily: "'Trebuchet MS', sans-serif",
                  lineHeight: 1.7,
                }}
              >
                {item.detail}
              </p>
            </div>
          ))}
        </section>

        {/* Prepare + Image Section */}
        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div
            style={{
              borderRadius: "28px",
              background: "linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)",
              padding: "44px 40px",
              boxShadow: "0 12px 48px rgba(190,24,93,0.30)",
              color: "#fff",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative circle */}
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-30px",
                left: "20px",
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
              }}
            />

            <h2
              style={{
                fontSize: "1.85rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: "28px",
                position: "relative",
              }}
            >
              How to prepare for your visit
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                position: "relative",
              }}
            >
              {[
                "Bring your ID, insurance card, and list of medications.",
                "Arrive 15 minutes early for check-in and paperwork.",
                "Share any symptoms or concerns clearly with your care team.",
              ].map((tip, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    fontFamily: "'Trebuchet MS', sans-serif",
                    fontSize: "1rem",
                    color: "rgba(255,255,255,0.92)",
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    style={{
                      minWidth: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      marginTop: "1px",
                    }}
                  >
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              borderRadius: "28px",
              overflow: "hidden",
              boxShadow: "0 12px 48px rgba(236,72,153,0.15)",
              border: "2px solid rgba(249,168,212,0.35)",
              position: "relative",
              minHeight: "300px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(236,72,153,0.12) 0%, transparent 60%)",
                zIndex: 1,
              }}
            />
            <img
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=1200&q=80"
              alt="Healthcare team supporting patients"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        </section>

        {/* CTA Banner */}
        <section
          className="mt-10 mb-6"
          style={{
            borderRadius: "24px",
            background: "rgba(255,255,255,0.72)",
            backdropFilter: "blur(12px)",
            border: "1.5px solid rgba(249,168,212,0.4)",
            padding: "36px 40px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            boxShadow: "0 4px 24px rgba(236,72,153,0.09)",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "#831843",
                marginBottom: "6px",
              }}
            >
              Ready to book your appointment?
            </h3>
            <p
              style={{
                color: "#9d174d",
                fontFamily: "'Trebuchet MS', sans-serif",
                fontSize: "0.97rem",
              }}
            >
              Our care team is here for you — schedule your visit in minutes.
            </p>
          </div>
          <button
            style={{
              background: "linear-gradient(135deg, #ec4899, #db2777)",
              color: "#fff",
              border: "none",
              borderRadius: "999px",
              padding: "14px 36px",
              fontSize: "1rem",
              fontWeight: 700,
              fontFamily: "'Trebuchet MS', sans-serif",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(190,24,93,0.30)",
              letterSpacing: "0.02em",
              transition: "transform 0.18s, box-shadow 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(190,24,93,0.40)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(190,24,93,0.30)";
            }}
          >
            Book Appointment →
          </button>
        </section>
      </main>
    </div>
  );
}