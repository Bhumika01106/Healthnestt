import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getCurrentUser } from "../systemStore";
import { appointmentsApi } from "../api";

const endOfAppointmentDay = (appointment) =>
  new Date(`${appointment.appointmentDate}T23:59:59`).getTime();

const statusClass = (status) =>
  status === "Paid"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-amber-100 text-amber-700";

const AppointmentCard = ({ appointment, onAction }) => {
  const pending = appointment.paymentStatus !== "Paid";

  return (
    <div className="rounded-[20px] xs:rounded-[24px] border border-slate-200 bg-white p-3 xs:p-4 sm:p-6 shadow-[0_12px_34px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-600 truncate">{appointment.id}</p>
          <h3 className="mt-2 xs:mt-3 text-lg xs:text-xl sm:text-2xl font-bold text-slate-950 truncate">
            {appointment.doctor || "Department Visit"}
          </h3>
          <p className="mt-1 text-xs xs:text-sm text-slate-600 truncate">{appointment.department}</p>
        </div>
        <span className={`w-fit rounded-full px-3 xs:px-4 py-1 xs:py-2 text-xs font-bold flex-shrink-0 ${statusClass(appointment.paymentStatus)}`}>
          {appointment.paymentStatus === "Paid" ? "Paid" : "Pending"}
        </span>
      </div>

      <div className="mt-4 xs:mt-6 grid gap-2 xs:gap-3 sm:gap-4 rounded-[16px] xs:rounded-2xl bg-slate-50 p-3 xs:p-4 sm:p-5 text-xs xs:text-sm text-slate-700 sm:grid-cols-3">
        <p className="break-words"><span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">Date</span><span className="font-medium">{appointment.appointmentDate}</span></p>
        <p><span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">Time</span><span className="font-medium">{appointment.appointmentTime}</span></p>
        <p><span className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">Fee</span><span className="font-medium">{appointment.fee}</span></p>
      </div>

      {appointment.status !== "Cancelled" && (
        <div className="mt-4 xs:mt-6 flex flex-col xs:flex-row gap-2 xs:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => onAction(appointment.id, { status: "Cancelled" })}
            className="rounded-full border border-red-200 bg-red-50 px-3 xs:px-4 sm:px-5 py-2 xs:py-3 text-xs xs:text-sm font-semibold text-red-600 transition hover:bg-red-100 whitespace-nowrap"
          >
            Cancel Appointment
          </button>
          <button
            type="button"
            onClick={() => onAction(appointment.id, { status: "Reschedule Requested" })}
            className="rounded-full border border-slate-200 bg-white px-3 xs:px-4 sm:px-5 py-2 xs:py-3 text-xs xs:text-sm font-semibold text-slate-700 transition hover:border-pink-300 hover:bg-pink-50 whitespace-nowrap"
          >
            Reschedule
          </button>
          {pending && (
            <button
              type="button"
              onClick={() => onAction(appointment.id, { paymentStatus: "Paid", paymentMethod: "online" })}
              className="rounded-full bg-pink-600 px-3 xs:px-4 sm:px-5 py-2 xs:py-3 text-xs xs:text-sm font-semibold text-white transition hover:bg-pink-700 whitespace-nowrap"
            >
              Pay Now
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default function MyAppointments() {
  const navigate = useNavigate();
  const user = useMemo(() => getCurrentUser(), []);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    let mounted = true;
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

  const appointmentsByTab = useMemo(() => {
    const sortedAppointments = [...appointments].sort(
      (a, b) => endOfAppointmentDay(a) - endOfAppointmentDay(b)
    );
    const now = Date.now();

    return {
      Upcoming: sortedAppointments.filter(
        (appointment) => appointment.status !== "Cancelled" && endOfAppointmentDay(appointment) >= now
      ),
      Past: sortedAppointments.filter(
        (appointment) => appointment.status !== "Cancelled" && endOfAppointmentDay(appointment) < now
      ),
      Cancelled: sortedAppointments.filter((appointment) => appointment.status === "Cancelled"),
    };
  }, [appointments]);

  const handleAction = async (appointmentId, updates) => {
    setError("");
    try {
      const data = await appointmentsApi.update(appointmentId, updates);
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === appointmentId ? data.appointment : appointment
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 pt-20 xs:pt-24 text-slate-900">
        <Navbar />
        <main className="mx-auto max-w-3xl px-3 xs:px-4 py-8 xs:py-12">
          <div className="rounded-[24px] xs:rounded-[28px] bg-white p-6 xs:p-8 sm:p-10 text-center shadow-xl">
            <h1 className="text-2xl xs:text-3xl font-bold">Login karein apne appointments manage karne ke liye</h1>
            <p className="mt-2 text-sm text-slate-500">HealthNest pe apne saare appointments ek jagah dekhen.</p>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="mt-4 xs:mt-6 rounded-full bg-pink-600 px-4 xs:px-6 py-2 xs:py-3 text-xs xs:text-sm font-semibold text-white hover:bg-pink-700"
            >
              Login Karein
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 xs:pt-24 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-2 xs:px-3 sm:px-4 py-6 xs:py-8 sm:py-10">
        <section className="rounded-[20px] xs:rounded-[28px] bg-white p-4 xs:p-6 sm:p-8 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
          <p className="text-xs xs:text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">HealthNest — Appointment Center</p>
          <div className="mt-2 xs:mt-3 flex flex-col gap-3 xs:gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-slate-950">Mere Appointments</h1>
              <p className="mt-2 xs:mt-3 max-w-2xl text-xs xs:text-sm text-slate-600">
                Apni aane wali visits, pichli consultations, cancellations aur payment status yahan dekhen.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/appointments")}
              className="w-full sm:w-auto rounded-full bg-pink-600 px-4 xs:px-6 py-2 xs:py-3 text-xs xs:text-sm font-semibold text-white transition hover:bg-pink-700 flex-shrink-0"
            >
              Naya Appointment Book Karein
            </button>
          </div>
        </section>

        <section className="mt-4 xs:mt-6 rounded-[20px] xs:rounded-[28px] bg-white p-3 xs:p-4 sm:p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
          <div className="grid gap-2 xs:gap-3 sm:grid-cols-3">
            {Object.keys(appointmentsByTab).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-[16px] xs:rounded-2xl px-3 xs:px-4 sm:px-5 py-2 xs:py-3 sm:py-4 text-xs xs:text-sm font-bold transition ${
                  activeTab === tab
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-600/20"
                    : "bg-slate-100 text-slate-700 hover:bg-pink-50 hover:text-pink-700"
                }`}
              >
                {tab} ({appointmentsByTab[tab].length})
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 xs:mt-6 space-y-3 xs:space-y-5">
          {loading ? (
            <div className="rounded-[20px] xs:rounded-[24px] bg-white p-6 xs:p-8 sm:p-10 text-center text-sm xs:text-base text-slate-600">
              Appointments load ho rahi hain...
            </div>
          ) : error ? (
            <div className="rounded-[20px] xs:rounded-[24px] border border-red-200 bg-red-50 p-6 xs:p-8 sm:p-10 text-center text-xs xs:text-sm text-red-700">
              {error}
            </div>
          ) : appointmentsByTab[activeTab].length ? (
            appointmentsByTab[activeTab].map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onAction={handleAction} />
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
              Koi {activeTab.toLowerCase()} appointment nahi mili.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}