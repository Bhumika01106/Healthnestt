import React from "react";
import Navbar from "./Navbar";

const highlights = [
  {
    title: "Vyaktigat Dekhbhal",
    description: "Har treatment plan aapki health history, pasand aur goals ko dhyan mein rakhkar banaya jaata hai.",
  },
  {
    title: "Technology ka Upyog",
    description: "Aadhunik diagnostics aur digital services care ko tez, sahi aur aasaan banate hain.",
  },
  {
    title: "Samudaay ki Sehat",
    description: "Hum parivaron aur buzurgon ke liye preventive care, shiksha aur support programs mein nivesh karte hain.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 text-slate-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <section className="grid gap-8 lg:grid-cols-2 items-center rounded-3xl bg-white p-10 shadow-lg">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-pink-600">Hum kaun hain</p>
            <h1 className="mt-4 text-5xl font-bold text-pink-700">Aapki poori sehat ki dekhbhal, har kadam par.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              HealthNest mein hum compassion aur clinical excellence ko milakar aisi medical services dete hain
              jo insaani, bharosemand aur aadhunik lagti hain. Hamare doctors aur support teams milkar kaam karte hain
              taaki har visit seamless ho aur har result behtar ho.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-pink-50 p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-pink-800">{item.title}</h2>
                  <p className="mt-3 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-xl">
            <img
              src="https://images.stockcake.com/public/4/5/4/454958fc-f583-45b4-9162-80aed15fef78_large/medical-team-working-stockcake.jpg"
              alt="Hospital team working together"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-pink-700">Hamara Mission</h2>
            <p className="mt-4 text-slate-600">
              Aisi vyaktigat medical care dena jo accessible, affordable ho
              aur vishwas tatha insaani rishte ki neev par tikhi ho.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-pink-700">Hamara Vision</h2>
            <p className="mt-4 text-slate-600">
              Innovation, preventive medicine aur community-centered wellness
              programs ke zariye ek healthier future banana.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-pink-700">Hamara Vaada</h2>
            <p className="mt-4 text-slate-600">
              Har baar jab aap hamare saath connect karein — compassionate support,
              clear communication aur skilled care milegi.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-2 items-center rounded-3xl bg-pink-600 text-white p-10 shadow-lg">
          <div>
            <h2 className="text-4xl font-bold">Samudaay programs jo aapko swasth rakhte hain.</h2>
            <p className="mt-4 text-lg leading-8 text-pink-100">
              Vaccination drives se lekar wellness workshops tak, hum patients
              aur parivaron ko muft shiksha, follow-up care aur bharosemand health advice dete hain.
            </p>
            <ul className="mt-6 space-y-3 text-pink-100">
              <li>• Preventive health screenings</li>
              <li>• Nutrition aur lifestyle coaching</li>
              <li>• Chronic care guidance aur remote follow-up</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/20 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1200&q=80"
              alt="Patient speaking with doctor"
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      </main>
    </div>
  );
}