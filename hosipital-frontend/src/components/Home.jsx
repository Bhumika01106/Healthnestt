import React from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { BsBookmarkStarFill } from "react-icons/bs";
import { BiSupport } from "react-icons/bi";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function LifeLineCare() {
  return (
    <div className="font-sans bg-slate-100 text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-pink-800 to-pink-500 text-white pt-32 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <p className="text-sm uppercase tracking-[0.3em] text-pink-200">Helping our patients and their families get back what matters most</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Compassionate Care, Advanced Medicine
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-pink-100">
                “Compassionate healthcare powered by technology, trusted doctors, and patient-first services.”
“Where expert doctors and modern healthcare come together for your well-being.”
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/appointments"
                  className="inline-flex items-center justify-center rounded-[20px] bg-rose-500 px-4 sm:px-6 md:px-8 py-4 text-base font-semibold text-white transition hover:bg-rose-400"
                >
                  Book Appointment
                </Link>
                <Link
                  to="/doctors"
                  className="inline-flex items-center justify-center rounded-[20px] border border-white bg-white px-4 sm:px-6 md:px-8 py-4 text-base font-semibold text-pink-800 transition hover:bg-pink-50"
                >
                  Meet Doctors
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://max-website20-images.s3.ap-south-1.amazonaws.com/Noida_128_811e8fe56b.jpg"
                alt="Patient care team"
                className="h-full w-full rounded-[40px] object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="grid gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["50+", "Expert Doctors", "text-pink-600"],
              ["15+", "Specialties", "text-rose-600"],
              ["25k+", "Appointments", "text-fuchsia-600"],
              ["10k+", "Patients Served", "text-pink-700"],
            ].map(([num, text, color], i) => (
              <div
                key={i}
                className="rounded-[32px] border border-slate-200 bg-white p-4 sm:p-6 md:p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h2 className={`${color} text-4xl font-bold`}>{num}</h2>
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-2 sm:px-3 md:px-4 lg:px-6 text-center">
          <h2 className="text-4xl font-bold text-slate-900">Why choose LifeLine Care?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            We combine expert doctors, fast booking, and modern patient support to keep your care experience easy, safe, and reliable.
          </p>

          <div className="mt-10 grid gap-3 sm:gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {[
              {
                icon: <FaUserDoctor className="text-4xl text-pink-600" />,
                title: "Expert Doctors",
                description: "A strong team of specialists available for both in-person and virtual consultations.",
              },
              {
                icon: <BsBookmarkStarFill className="text-4xl text-pink-600" />,
                title: "Quick Booking",
                description: "Schedule your visits and follow-ups in seconds with simple, guided booking flows.",
              },
              {
                icon: <BiSupport className="text-4xl text-pink-600" />,
                title: "24/7 Support",
                description: "Patient support, medical guidance, and follow-up reminders when you need them.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[32px] border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex justify-center">{item.icon}</div>
                <h3 className="mt-6 text-2xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-4 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-2 sm:px-3 md:px-4 lg:px-6">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-pink-600">Our services</p>
              <h2 className="mt-4 text-4xl font-bold text-slate-900">Specialized care for every health need.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                From diagnostics to long-term wellness and pediatric care, our teams help you every step of the way.
              </p>
            </div>

            <div className="grid gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Diagnostics",
                  description: "Advanced labs, imaging, and screening services for accurate treatment planning.",
                },
                {
                  title: "Family Medicine",
                  description: "Primary care and wellness checks for patients of all ages.",
                },
                {
                  title: "Surgery",
                  description: "Modern surgical procedures supported by expert recovery planning.",
                },
                {
                  title: "Telehealth",
                  description: "Remote appointments and follow-ups from the comfort of your home.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[32px] border border-slate-200 bg-white p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-lg">
                  <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-4 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pink-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-2 sm:px-3 md:px-4 lg:px-6 text-center">
          <h2 className="text-4xl font-bold">Your care journey starts with one appointment.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-pink-100">
            Book your first visit now and discover the future of patient-centered healthcare.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/appointments"
              className="rounded-full bg-white px-4 sm:px-6 md:px-8 py-4 text-base font-semibold text-pink-900 transition hover:bg-pink-100"
            >
              Book Appointment
            </Link>
            <Link
              to="/signup"
              className="rounded-full border border-white bg-transparent px-4 sm:px-6 md:px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Patient Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}