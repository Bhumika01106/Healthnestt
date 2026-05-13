import React from "react";
import Navbar from "./Navbar";
import { BiSupport, BiPhoneCall, BiEnvelope, BiMessageDetail, BiQuestionMark } from "react-icons/bi";

export default function PatientSupport() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-14">

        {/* Hero */}
        <section className="rounded-[32px] bg-gradient-to-br from-pink-700 to-rose-500 px-7 py-12 text-white shadow-2xl sm:px-10 sm:py-16">
          <p className="text-sm uppercase tracking-[0.32em] text-pink-100">HealthNest — Patient Support</p>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Aapki care journey mein hum saath hain</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-pink-100">
            Appointments, medical sawaalon aur emergency guidance ke liye HealthNest ki dedicated support team hamesha taiyaar hai.
          </p>
        </section>

        {/* Contact Cards */}
        <section className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="rounded-[32px] bg-white p-8 shadow-lg ring-1 ring-pink-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-pink-50 text-pink-600">
              <BiPhoneCall className="text-3xl" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-slate-900">Phone Support</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Urgent appointment changes aur general patient sawaalon ke liye turant madad paayein.
            </p>
            <p className="mt-6 text-lg font-semibold text-pink-600">+91 9876543210</p>
          </div>
          <div className="rounded-[32px] bg-white p-8 shadow-lg ring-1 ring-pink-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-pink-50 text-pink-600">
              <BiEnvelope className="text-3xl" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-slate-900">Email Support</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Apne sawaal humein bhejein aur hamare patient services staff se jaldi guidance paayein.
            </p>
            <p className="mt-6 text-lg font-semibold text-pink-600">healthnest@gmail.com</p>
          </div>
          <div className="rounded-[32px] bg-white p-8 shadow-lg ring-1 ring-pink-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-pink-50 text-pink-600">
              <BiMessageDetail className="text-3xl" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-slate-900">Appointment Help</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Hum aapko reschedule karne, visit ke liye taiyaar hone aur pre-care instructions samjhane mein madad karte hain.
            </p>
            <p className="mt-6 text-lg font-semibold text-pink-600">Patient portal se book karein ya call karein.</p>
          </div>
        </section>

        {/* Emergency Support */}
        <section className="mt-12 rounded-[32px] bg-white p-8 shadow-lg ring-1 ring-pink-100 sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-pink-600">Emergency Support</p>
              <h2 className="mt-4 text-3xl font-bold text-slate-900">Turant madad chahiye?</h2>
            </div>
            <div className="rounded-3xl bg-pink-50 p-6 text-slate-700 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pink-400">24/7 Service</p>
              <p className="mt-4 text-lg font-semibold text-slate-900">Hum din-raat patient support ke liye available hain.</p>
            </div>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "Bharosemand Madad",
                description: "Hamare care coordinators aapke support requests ka jawab dene aur agle steps mein guide karne ke liye taiyaar hain.",
                icon: <BiSupport className="text-3xl text-pink-600" />,
              },
              {
                title: "Aksar Pooche Sawal (FAQ)",
                description: "Appointments, billing aur medical support ke baare mein common sawaalon ke jawaab yahan paayein.",
                icon: <BiQuestionMark className="text-3xl text-pink-600" />,
              },
              {
                title: "Tez Contact",
                description: "Humein email karein ya support desk pe call karein — hum clear care advice ke saath jaldi respond karenge.",
                icon: <BiPhoneCall className="text-3xl text-pink-600" />,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl bg-pink-50 p-6 text-slate-700 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-pink-600">
                  {item.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Cards */}
        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            {
              label: "Appointment kaise update karein?",
              answer: "Patient portal mein login karein ya support se contact karein. Zaroort padne par hum aapko reschedule karne mein madad karenge.",
            },
            {
              label: "Visit pe kya leke aayen?",
              answer: "Apna ID, insurance card, medicines ki list aur koi bhi recent medical records zarur saath laayen.",
            },
            {
              label: "Kya phone consultation ho sakti hai?",
              answer: "Haan, hamare team virtual care arrange kar sakti hai — aapki condition aur doctor ki availability ke hisab se.",
            },
          ].map((faq) => (
            <article key={faq.label} className="rounded-[28px] bg-white p-6 shadow-lg ring-1 ring-pink-100">
              <h3 className="text-lg font-semibold text-slate-900">{faq.label}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{faq.answer}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}