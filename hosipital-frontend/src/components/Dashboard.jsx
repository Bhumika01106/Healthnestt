import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getCurrentUser } from "../systemStore";
import { appointmentsApi } from "../api";

const endOfAppointmentDay = (appointment) =>
  new Date(`${appointment.appointmentDate}T23:59:59`).getTime();

const initials = (name = "Patient") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useMemo(() => getCurrentUser(), []);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    let mounted = true;
    setLoading(true);
    appointmentsApi
      .list()
      .then((data) => {
        if (mounted) setAppointments(data.appointments || []);
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  const dashboardData = useMemo(() => {
    const activeAppointments = appointments.filter((item) => item.status !== "Cancelled");
    const now = Date.now();
    const upcoming = activeAppointments
      .filter((item) => endOfAppointmentDay(item) >= now)
      .sort((a, b) => endOfAppointmentDay(a) - endOfAppointmentDay(b));
    const completed = activeAppointments.filter((item) => endOfAppointmentDay(item) < now);
    const pendingPayments = activeAppointments.filter((item) => item.paymentStatus !== "Paid");

    return {
      upcoming,
      completed,
      pendingPayments,
      nextAppointment: upcoming[0],
    };
  }, [appointments]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 pt-24 text-slate-900">
        <Navbar />
        <main className="mx-auto max-w-3xl px-2 sm:px-3 md:px-4 lg:px-6 py-12">
          <div className="rounded-3xl bg-white p-6 sm:p-8 md:p-10 text-center shadow-xl">
            <h1 className="text-3xl font-bold">Please login to view your dashboard</h1>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="mt-6 rounded-full bg-blue-600 px-4 sm:px-5 md:px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </main>
      </div>
    );
  }

  const summaryCards = [
    {
      label: "Upcoming Appointments",
      value: dashboardData.upcoming.length,
      accent: "bg-pink-50 text-pink-700",
    },
    {
      label: "Completed Appointments",
      value: dashboardData.completed.length,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Pending Payments",
      value: dashboardData.pendingPayments.length,
      accent: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#eef3f8] pt-24 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-2 sm:px-3 md:px-4 lg:px-6 py-10">
        <section className="grid gap-6 md:grid-cols-1 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-[28px] bg-white p-4 sm:p-6 md:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 rounded-3xl object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-16 sm:h-20 md:h-24 w-16 sm:w-20 md:w-24 items-center justify-center rounded-3xl bg-pink-600 text-3xl font-bold text-white shadow-lg">
                  {initials(user.name)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">
                  Patient Overview
                </p>
                <h1 className="mt-3 text-4xl font-bold text-slate-950">Welcome back, {user.name}</h1>
                <p className="mt-3 max-w-2xl text-slate-600">
                  Here is a quick view of your care schedule, payment status, and next visit.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-slate-950 p-4 sm:p-6 md:p-8 text-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">Care Tip</p>
            <h2 className="mt-4 text-2xl font-bold">Bring previous reports</h2>
            <p className="mt-3 text-slate-300">
              Carry recent prescriptions, lab reports, and ID proof to help your doctor review your case faster.
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:gap-4 md:gap-5 md:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-[24px] bg-white p-4 sm:p-5 md:p-6 shadow-[0_14px_36px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className={`inline-flex rounded-2xl px-4 py-2 text-sm font-semibold ${card.accent}`}>
                {card.label}
              </div>
              <p className="mt-5 text-4xl font-bold text-slate-950">{card.value}</p>
            </div>
          ))}
        </section>

        {loading && (
          <div className="mt-6 rounded-3xl bg-white p-4 sm:p-5 md:p-6 text-slate-600 shadow-sm">
            Loading your dashboard data...
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 sm:p-5 md:p-6 text-red-700">
            {error}
          </div>
        )}

        <section className="mt-6 grid gap-6 md:grid-cols-1 lg:grid-cols-[1fr_0.75fr]">
          <div className="rounded-[28px] bg-white p-4 sm:p-6 md:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">
              Next Appointment
            </p>
            {dashboardData.nextAppointment ? (
              <div className="mt-5 rounded-3xl border border-pink-100 bg-blue-50 p-4 sm:p-5 md:p-6">
                <h2 className="text-3xl font-bold text-slate-950">
                  {dashboardData.nextAppointment.doctor || dashboardData.nextAppointment.department}
                </h2>
                <p className="mt-2 text-slate-600">{dashboardData.nextAppointment.department}</p>
                <div className="mt-6 grid gap-3 sm:gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Date</p>
                    <p className="mt-1 font-bold text-slate-900">{dashboardData.nextAppointment.appointmentDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Time</p>
                    <p className="mt-1 font-bold text-slate-900">{dashboardData.nextAppointment.appointmentTime}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Payment</p>
                    <p className="mt-1 font-bold text-slate-900">{dashboardData.nextAppointment.paymentStatus}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 sm:p-7 md:p-8 text-slate-600">
                You do not have an upcoming appointment yet.
              </div>
            )}
          </div>

          <div className="rounded-[28px] bg-white p-4 sm:p-6 md:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">Quick Actions</p>
            <div className="mt-5 grid gap-3">
              <Link
                to="/appointments"
                className="rounded-2xl bg-pink-600 px-3 sm:px-4 md:px-5 py-4 text-center font-semibold text-white transition hover:bg-pink-700"
              >
                Book Appointment
              </Link>
              <Link
                to="/my-appointments"
                className="rounded-2xl border border-slate-200 bg-slate-50 px-3 sm:px-4 md:px-5 py-4 text-center font-semibold text-slate-800 transition hover:border-pink-300 hover:bg-pink-50"
              >
                View My Appointments
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
