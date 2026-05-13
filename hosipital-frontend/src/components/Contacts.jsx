import React from "react";
import Navbar from "./Navbar";

export default function Contact() {
  return (
    <div className="min-h-screen pt-20 xs:pt-24 text-slate-900 overflow-x-hidden" style={{ background: "linear-gradient(135deg, #fff0f6 0%, #fce4ec 40%, #fdf2f8 100%)" }}>
      <Navbar />
      <main className="mx-auto max-w-7xl px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 py-8 xs:py-10 sm:py-12 md:py-14">

        <section className="rounded-[20px] xs:rounded-[28px] md:rounded-[32px] px-3 xs:px-4 sm:px-6 md:px-8 py-6 xs:py-8 sm:py-10 md:py-14 text-white shadow-2xl" style={{ background: "linear-gradient(135deg, #f43f8e 0%, #ec4899 50%, #db2777 100%)" }}>
          <p className="text-xs xs:text-sm uppercase tracking-[0.3em]" style={{ color: "#fce7f3" }}>Get in touch</p>
          <h1 className="mt-2 xs:mt-4 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">We're here for you 24/7.</h1>
          <p className="mt-4 xs:mt-6 max-w-3xl text-sm xs:text-base md:text-lg leading-7" style={{ color: "rgba(255,255,255,0.88)" }}>
            Reach out anytime for appointments, medical questions, or patient support. Our care team is ready to help you feel confident and informed.
          </p>
        </section>

        <section className="mt-8 xs:mt-10 sm:mt-12 grid gap-4 xs:gap-6 sm:gap-8 lg:grid-cols-2">

          <div className="rounded-[20px] xs:rounded-[28px] md:rounded-[32px] p-4 xs:p-6 md:p-10 shadow-lg" style={{ background: "rgba(255,255,255,0.82)", border: "1.5px solid rgba(249,168,212,0.45)" }}>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold" style={{ color: "#831843" }}>Contact details</h2>
            <ul className="mt-6 xs:mt-8 space-y-3 xs:space-y-4 sm:space-y-5 text-sm xs:text-base" style={{ color: "#9d174d" }}>
              <li className="break-words">
                <span className="font-semibold" style={{ color: "#831843" }}>Phone:</span> +91 9876543210
              </li>
              <li className="break-words">
                <span className="font-semibold" style={{ color: "#831843" }}>Email:</span> healpath@gmail.com
              </li>
              <li className="break-words">
                <span className="font-semibold" style={{ color: "#831843" }}>Location:</span> 143 Healthcare Avenue, Doda, Jammu &amp; Kashmir
              </li>
            </ul>
          </div>

          <div className="rounded-[20px] xs:rounded-[28px] md:rounded-[32px] p-4 xs:p-6 md:p-10 shadow-lg" style={{ background: "rgba(255,255,255,0.82)", border: "1.5px solid rgba(249,168,212,0.45)" }}>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-semibold" style={{ color: "#831843" }}>Send us a message</h2>
            <form className="mt-6 xs:mt-8 space-y-4 xs:space-y-5 sm:space-y-6">
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-2xl xs:rounded-3xl px-3 xs:px-4 md:px-5 py-3 xs:py-4 text-xs xs:text-sm outline-none transition"
                style={{ border: "1.5px solid rgba(249,168,212,0.6)", background: "#fdf2f8", color: "#831843" }}
              />
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-2xl xs:rounded-3xl px-3 xs:px-4 md:px-5 py-3 xs:py-4 text-xs xs:text-sm outline-none transition"
                style={{ border: "1.5px solid rgba(249,168,212,0.6)", background: "#fdf2f8", color: "#831843" }}
              />
              <textarea
                rows="5"
                placeholder="How can we help you?"
                className="w-full rounded-2xl xs:rounded-3xl px-3 xs:px-4 md:px-5 py-3 xs:py-4 text-xs xs:text-sm outline-none transition resize-none"
                style={{ border: "1.5px solid rgba(249,168,212,0.6)", background: "#fdf2f8", color: "#831843" }}
              />
              <button
                type="button"
                className="w-full rounded-full px-4 xs:px-5 md:px-6 py-3 xs:py-4 text-xs xs:text-base font-semibold text-white transition active:scale-95"
                style={{ background: "linear-gradient(135deg, #f43f8e, #db2777)", boxShadow: "0 6px 24px rgba(190,24,93,0.30)" }}
              >
                Send Message
              </button>
            </form>
          </div>

        </section>
      </main>
    </div>
  );
}