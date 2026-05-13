import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {
  clearAppointmentDraft,
  getAppointmentDraft,
  getCurrentUser,
  isLoggedIn,
  saveAppointmentDraft,
} from "../systemStore";
import { appointmentsApi, catalogApi } from "../api";

const defaultDepartments = [
  { key: "Cardiology", label: "Cardiology", description: "Expert heart care, diagnostics & cardiac consultations.", fee: "₹1,200" },
  { key: "Neurology", label: "Neurology", description: "Advanced brain & nervous system specialist care.", fee: "₹1,100" },
  { key: "Orthopedics", label: "Orthopedics", description: "Bone, joint & sports medicine consultations.", fee: "₹950" },
  { key: "Dermatology", label: "Dermatology", description: "Skin, hair & cosmetic health treatments.", fee: "₹850" },
];

const defaultDoctors = [
  { name: "Dr. Neha Singh", specialty: "Cardiology", fee: "₹1,200", tagline: "Interventional cardiologist" },
  { name: "Dr. Rajiv Kumar", specialty: "Neurology", fee: "₹1,100", tagline: "Stroke & migraine specialist" },
  { name: "Dr. Anjali Mehta", specialty: "Orthopedics", fee: "₹950", tagline: "Joint pain & sports injuries" },
  { name: "Dr. Priya Sharma", specialty: "Dermatology", fee: "₹850", tagline: "Skin wellness therapies" },
];

const availableSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"];
const paymentProviders = ["Google Pay", "PhonePe", "Paytm"];

const formatDate = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
};

/* ─── Pink palette tokens ─────────────────────────── */
const P = {
  grad: "linear-gradient(135deg, #f43f8e 0%, #ec4899 45%, #db2777 100%)",
  gradLight: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
  rose: "#be185d",
  pink: "#ec4899",
  light: "#fdf2f8",
  border: "rgba(249,168,212,0.45)",
  shadow: "rgba(236,72,153,0.18)",
  shadowXl: "rgba(190,24,93,0.28)",
  text: "#831843",
  muted: "#9d174d",
};

const card = {
  borderRadius: "24px",
  background: "rgba(255,255,255,0.82)",
  backdropFilter: "blur(14px)",
  border: `1.5px solid ${P.border}`,
  boxShadow: `0 4px 28px ${P.shadow}`,
};

const pillActive = {
  background: P.grad,
  color: "#fff",
  border: "none",
  borderRadius: "999px",
  padding: "8px 20px",
  fontSize: "0.8rem",
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s",
};

const pillInactive = {
  background: "rgba(255,255,255,0.8)",
  color: P.rose,
  border: `1.5px solid ${P.border}`,
  borderRadius: "999px",
  padding: "8px 20px",
  fontSize: "0.8rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s",
};

const inputStyle = (hasError) => ({
  marginTop: "10px",
  width: "100%",
  borderRadius: "14px",
  border: hasError ? "1.5px solid #f43f8e" : `1.5px solid ${P.border}`,
  background: hasError ? "#fff0f6" : "#fff",
  padding: "12px 16px",
  color: P.text,
  fontSize: "0.9rem",
  outline: "none",
  transition: "border 0.2s, box-shadow 0.2s",
  boxSizing: "border-box",
});

export default function Appointments() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const prefill = {
    ...(location.state || {}),
    department: query.get("department") || location.state?.department,
    doctor: query.get("doctor") || location.state?.doctor,
    fee: query.get("fee") || location.state?.fee,
  };
  const currentUser = useMemo(() => getCurrentUser(), []);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBy, setSelectedBy] = useState("doctor");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedFee, setSelectedFee] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [patientInfo, setPatientInfo] = useState({ fullName: "", phone: "", email: "", dateOfBirth: "", gender: "", address: "" });
  const [patientTouched, setPatientTouched] = useState({});
  const [cardTouched, setCardTouched] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("offline");
  const [onlineMethod, setOnlineMethod] = useState("upi");
  const [upiProvider, setUpiProvider] = useState("");
  const [cardInfo, setCardInfo] = useState({ cardNumber: "", cardExpiry: "", cardCvv: "", cardName: "" });
  const [stepTouched, setStepTouched] = useState({ 1: false, 2: false, 3: false, 4: false });
  const [bookingId, setBookingId] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState(defaultDepartments);
  const [doctors, setDoctors] = useState(defaultDoctors);

  useEffect(() => {
    Promise.all([catalogApi.departments(), catalogApi.doctors()])
      .then(([departmentData, doctorData]) => {
        setDepartments((departmentData.departments || []).map((d) => ({ key: d.name, label: d.name, description: d.description, fee: "Starting ₹499" })));
        setDoctors((doctorData.doctors || []).map((d) => ({ id: d._id, name: d.name, specialty: d.department, fee: d.fee, tagline: d.specialization })));
      })
      .catch(() => { setDepartments(defaultDepartments); setDoctors(defaultDoctors); });
  }, []);

  useEffect(() => {
    const draft = getAppointmentDraft();
    if (!draft) return;
    setCurrentStep(draft.currentStep || 1);
    setSelectedBy(draft.selectedBy || "doctor");
    setSelectedDepartment(draft.selectedDepartment || "");
    setSelectedDoctor(draft.selectedDoctor || "");
    setSelectedFee(draft.selectedFee || "");
    setAppointmentDate(draft.appointmentDate || "");
    setAppointmentTime(draft.appointmentTime || "");
    setPatientInfo(draft.patientInfo || { fullName: "", phone: "", email: "", dateOfBirth: "", gender: "", address: "" });
    setPaymentMethod(draft.paymentMethod || "offline");
    setOnlineMethod(draft.onlineMethod || "upi");
    setUpiProvider(draft.upiProvider || "");
    setCardInfo(draft.cardInfo || { cardNumber: "", cardExpiry: "", cardCvv: "", cardName: "" });
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    setPatientInfo((prev) => ({ ...prev, fullName: prev.fullName || currentUser.name || "", email: prev.email || currentUser.email || "", phone: prev.phone || currentUser.phone || "" }));
  }, [currentUser]);

  useEffect(() => {
    if (prefill.doctor) {
      setSelectedBy("doctor"); setSelectedDoctor(prefill.doctor); setSelectedDepartment(prefill.department || "");
      setSelectedFee(prefill.fee || doctors.find((i) => i.name === prefill.doctor)?.fee || "");
    } else if (prefill.department) {
      setSelectedBy("department"); setSelectedDepartment(prefill.department);
      setSelectedFee(prefill.fee || departments.find((i) => i.key === prefill.department)?.fee || "");
    }
  }, [prefill.doctor, prefill.department, prefill.fee, departments, doctors]);

  const activeDoctor = useMemo(() => doctors.find((i) => i.name === selectedDoctor), [doctors, selectedDoctor]);
  const selectedFeeDisplay = activeDoctor?.fee || selectedFee || "Starting ₹499";

  const isStepOneValid = Boolean((selectedBy === "doctor" && selectedDoctor) || (selectedBy === "department" && selectedDepartment));
  const isStepTwoValid = Boolean(appointmentDate && appointmentTime);
  const isStepThreeValid = Boolean(patientInfo.fullName.trim() && patientInfo.phone.trim() && patientInfo.email.trim() && patientInfo.dateOfBirth.trim() && patientInfo.gender.trim() && patientInfo.address.trim());
  const isStepFourValid = paymentMethod === "offline" ? true : onlineMethod === "upi" ? Boolean(upiProvider) : Boolean(cardInfo.cardNumber.trim().length >= 12 && cardInfo.cardExpiry.trim().length >= 4 && cardInfo.cardCvv.trim().length >= 3 && cardInfo.cardName.trim());

  const currentErrors = { 1: !isStepOneValid && stepTouched[1], 2: !isStepTwoValid && stepTouched[2], 3: !isStepThreeValid && stepTouched[3], 4: !isStepFourValid && stepTouched[4] };

  const handleStepTouch = (step) => setStepTouched((prev) => ({ ...prev, [step]: true }));
  const handleSelectType = (type) => { handleStepTouch(1); setSelectedBy(type); if (type === "department") setSelectedDoctor(""); };
  const handleSelectDepartment = (key) => { handleStepTouch(1); setSelectedDepartment(key); setSelectedDoctor(""); setSelectedFee(departments.find((i) => i.key === key)?.fee || ""); };
  const handleSelectDoctor = (name) => { handleStepTouch(1); setSelectedDoctor(name); const d = doctors.find((i) => i.name === name); if (d) { setSelectedDepartment(d.specialty); setSelectedFee(d.fee); } };
  const handlePatientChange = (e) => { const { name, value } = e.target; setPatientInfo((prev) => ({ ...prev, [name]: value })); setPatientTouched((prev) => ({ ...prev, [name]: true })); handleStepTouch(3); };
  const handleCardChange = (e) => { const { name, value } = e.target; setCardInfo((prev) => ({ ...prev, [name]: value })); setCardTouched((prev) => ({ ...prev, [name]: true })); handleStepTouch(4); };
  const generateBookingId = () => `HN-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  const buildDraft = () => ({ currentStep, selectedBy, selectedDepartment, selectedDoctor, selectedFee, appointmentDate, appointmentTime, patientInfo, paymentMethod, onlineMethod, upiProvider, cardInfo });

  const handleLoginToConfirm = () => {
    saveAppointmentDraft(buildDraft());
    localStorage.setItem("healthnest_post_login_redirect", `${location.pathname}${location.search}`);
    navigate("/signup");
  };

  const confirmAppointment = async () => {
    setSubmitting(true); setSubmitError("");
    try {
      const data = await appointmentsApi.create({ doctorName: selectedDoctor, department: selectedDepartment, date: appointmentDate, time: appointmentTime, fee: selectedFeeDisplay, paymentMethod: paymentMethod === "online" ? "online" : "offline", paymentProvider: onlineMethod === "upi" ? upiProvider : onlineMethod, patient: { fullName: patientInfo.fullName, email: patientInfo.email, phone: patientInfo.phone, dateOfBirth: patientInfo.dateOfBirth, gender: patientInfo.gender, address: patientInfo.address } });
      clearAppointmentDraft(); setBookingId(data.appointment.id || generateBookingId()); setCurrentStep(5);
    } catch (error) { setSubmitError(error.message); } finally { setSubmitting(false); }
  };

  const handleContinue = async () => {
    handleStepTouch(currentStep);
    if (currentStep === 1 && isStepOneValid) { setCurrentStep(2); return; }
    if (currentStep === 2 && isStepTwoValid) { setCurrentStep(3); return; }
    if (currentStep === 3 && isStepThreeValid) { setCurrentStep(4); return; }
    if (currentStep === 4 && isStepFourValid) {
      if (!isLoggedIn()) { saveAppointmentDraft(buildDraft()); localStorage.setItem("healthnest_post_login_redirect", `${location.pathname}${location.search}`); setLoginMessage("Please login to confirm your appointment"); return; }
      await confirmAppointment();
    }
  };

  const handleBack = () => { if (currentStep > 1) setCurrentStep((prev) => prev - 1); };
  const paymentSummary = paymentMethod === "offline" ? "Pay at hospital" : onlineMethod === "upi" ? `Online via ${upiProvider || "UPI"}` : `Card ending ${cardInfo.cardNumber.slice(-4)}`;

  const stepLabels = ["Select", "Schedule", "Details", "Payment", "Done"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #fff0f6 0%, #fce4ec 45%, #fdf2f8 100%)",
        fontFamily: "'Georgia', serif",
        position: "relative",
        paddingTop: "96px",
      }}
    >
      {/* Decorative blobs */}
      <div style={{ position: "fixed", top: -140, right: -140, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #f9a8d4 0%, transparent 70%)", opacity: 0.3, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: -100, left: -80, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, #f472b6 0%, transparent 70%)", opacity: 0.2, pointerEvents: "none", zIndex: 0 }} />

      <Navbar />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px 48px", position: "relative", zIndex: 1 }}>

        {/* ── Header banner ── */}
        <div style={{ borderRadius: "32px", background: P.grad, padding: "40px 40px 36px", boxShadow: `0 20px 60px ${P.shadowXl}`, marginBottom: "28px", position: "relative", overflow: "hidden" }}>
          {/* floating circles */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", bottom: -40, left: "30%", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
            <div style={{ maxWidth: "560px" }}>
              <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: "999px", padding: "4px 16px", fontSize: "0.72rem", letterSpacing: "0.25em", fontFamily: "sans-serif", fontWeight: 700, textTransform: "uppercase", marginBottom: "14px" }}>
                HealthNest
              </span>
              <h1 style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "14px" }}>
                Book Your Appointment<br />with Ease & Care
              </h1>
              <p style={{ color: "rgba(255,255,255,0.88)", fontSize: "1rem", lineHeight: 1.7, fontFamily: "sans-serif", marginBottom: "20px" }}>
                Choose your doctor or department, pick a convenient slot, share your details, and confirm — all in one seamless flow built with your comfort in mind.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {["Instant Confirmation", "Secure Payments", "Compassionate Care"].map((tag) => (
                  <span key={tag} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: "999px", padding: "6px 16px", fontSize: "0.78rem", fontFamily: "sans-serif", fontWeight: 600 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Sidebar image card */}
            <div style={{ borderRadius: "24px", overflow: "hidden", width: "260px", height: "200px", flexShrink: 0, boxShadow: "0 12px 40px rgba(0,0,0,0.25)", border: "2px solid rgba(255,255,255,0.25)", display: "none" }} className="hidden-mobile">
              <img
                src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=600&q=80"
                alt="Doctor with patient"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>

        {/* ── Step progress ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px", overflowX: "auto", paddingBottom: "4px" }}>
          {stepLabels.map((label, i) => {
            const step = i + 1;
            const isActive = currentStep === step;
            const isDone = currentStep > step;
            return (
              <React.Fragment key={label}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", minWidth: "52px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: isDone ? P.grad : isActive ? P.grad : "rgba(255,255,255,0.7)", border: `2px solid ${isDone || isActive ? P.pink : P.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 700, color: isDone || isActive ? "#fff" : P.muted, boxShadow: isActive ? `0 0 0 4px rgba(236,72,153,0.2)` : "none", transition: "all 0.3s", fontFamily: "sans-serif" }}>
                    {isDone ? "✓" : step}
                  </div>
                  <span style={{ fontSize: "0.65rem", fontFamily: "sans-serif", fontWeight: 600, color: isActive ? P.rose : P.muted, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div style={{ flex: 1, height: "2px", background: currentStep > step ? P.grad : P.border, borderRadius: "999px", minWidth: "16px", transition: "background 0.3s" }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Main grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }} className="appointments-grid">
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.9fr", gap: "24px" }}>

            {/* ── LEFT: Step content ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ ...card, padding: "32px 28px" }}>

                {/* STEP 1 */}
                {currentStep === 1 && (
                  <div>
                    <span style={{ fontSize: "0.7rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: P.pink }}>Step 1 · Selection</span>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: P.text, marginTop: "10px", marginBottom: "8px", letterSpacing: "-0.02em" }}>Choose your care path</h2>
                    <p style={{ color: P.muted, fontSize: "0.92rem", fontFamily: "sans-serif", lineHeight: 1.65, marginBottom: "24px" }}>
                      Browse by department or pick a doctor directly. Pre-filled if you arrived from another page.
                    </p>

                    <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
                      {[{ id: "department", label: "🏥 By Department", desc: "Browse specialists by care area." }, { id: "doctor", label: "👩‍⚕️ By Doctor", desc: "Choose your preferred doctor." }].map((item) => (
                        <button key={item.id} type="button" onClick={() => handleSelectType(item.id)} style={{ flex: 1, minWidth: "140px", borderRadius: "18px", border: selectedBy === item.id ? `2px solid ${P.pink}` : `1.5px solid ${P.border}`, background: selectedBy === item.id ? "linear-gradient(135deg,#fff0f6,#fce7f3)" : "rgba(255,255,255,0.8)", padding: "16px 18px", textAlign: "left", cursor: "pointer", transform: selectedBy === item.id ? "scale(1.02)" : "scale(1)", boxShadow: selectedBy === item.id ? `0 6px 24px ${P.shadow}` : "none", transition: "all 0.2s" }}>
                          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: P.text, marginBottom: "4px" }}>{item.label}</p>
                          <p style={{ fontSize: "0.78rem", color: P.muted, fontFamily: "sans-serif" }}>{item.desc}</p>
                        </button>
                      ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px", marginBottom: "24px" }}>
                      {(selectedBy === "department" ? departments : doctors).map((item) => {
                        const active = selectedBy === "department" ? selectedDepartment === item.key : selectedDoctor === item.name;
                        return (
                          <button key={selectedBy === "department" ? item.key : item.name} type="button"
                            onClick={() => selectedBy === "department" ? handleSelectDepartment(item.key) : handleSelectDoctor(item.name)}
                            style={{ borderRadius: "18px", border: active ? `2px solid ${P.pink}` : `1.5px solid ${P.border}`, background: active ? "linear-gradient(135deg,#fff0f6,#fce7f3)" : "rgba(255,255,255,0.85)", padding: "18px 16px", textAlign: "left", cursor: "pointer", boxShadow: active ? `0 8px 28px ${P.shadow}` : "none", transition: "all 0.22s", position: "relative" }}
                            onMouseEnter={(e) => { if (!active) { e.currentTarget.style.border = `1.5px solid ${P.pink}`; e.currentTarget.style.boxShadow = `0 4px 16px ${P.shadow}`; } }}
                            onMouseLeave={(e) => { if (!active) { e.currentTarget.style.border = `1.5px solid ${P.border}`; e.currentTarget.style.boxShadow = "none"; } }}
                          >
                            {active && <span style={{ position: "absolute", top: "10px", right: "10px", background: P.grad, color: "#fff", borderRadius: "999px", padding: "2px 10px", fontSize: "0.65rem", fontWeight: 700, fontFamily: "sans-serif" }}>✓ Selected</span>}
                            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: P.text, marginBottom: "6px", paddingRight: active ? "70px" : "0" }}>{selectedBy === "department" ? item.label : item.name}</p>
                            <p style={{ fontSize: "0.78rem", color: P.muted, fontFamily: "sans-serif", lineHeight: 1.5, marginBottom: "10px" }}>{selectedBy === "department" ? item.description : item.tagline}</p>
                            <p style={{ fontSize: "0.78rem", color: P.pink, fontFamily: "sans-serif", fontWeight: 600 }}>Fee {selectedBy === "department" ? item.fee : `${item.fee} · ${item.specialty}`}</p>
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ borderRadius: "18px", background: "linear-gradient(135deg,#fdf2f8,#fce7f3)", border: `1.5px solid ${P.border}`, padding: "18px 20px" }}>
                      <p style={{ fontSize: "0.7rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: P.pink, marginBottom: "8px" }}>Your Current Selection</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
                        <p style={{ fontSize: "1.05rem", fontWeight: 700, color: P.text }}>{selectedDoctor || selectedDepartment || "No selection yet"}</p>
                        <span style={{ ...pillActive, fontSize: "0.7rem", padding: "4px 14px" }}>{selectedBy === "doctor" ? "Doctor" : "Department"}</span>
                      </div>
                      {selectedDoctor && <p style={{ fontSize: "0.82rem", color: P.muted, fontFamily: "sans-serif", marginTop: "4px" }}>{activeDoctor?.specialty} · Fee {selectedFeeDisplay}</p>}
                    </div>
                    {currentErrors[1] && <div style={{ marginTop: "14px", borderRadius: "14px", border: "1.5px solid #fca5a5", background: "#fff0f0", padding: "10px 16px", fontSize: "0.85rem", color: "#b91c1c", fontFamily: "sans-serif" }}>Please complete this step to continue.</div>}
                  </div>
                )}

                {/* STEP 2 */}
                {currentStep === 2 && (
                  <div>
                    <span style={{ fontSize: "0.7rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: P.pink }}>Step 2 · Schedule</span>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: P.text, marginTop: "10px", marginBottom: "8px", letterSpacing: "-0.02em" }}>Pick your appointment slot</h2>
                    <p style={{ color: P.muted, fontSize: "0.92rem", fontFamily: "sans-serif", lineHeight: 1.65, marginBottom: "24px" }}>Choose a date and a convenient time slot from the available options below.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                      <label style={{ display: "block", borderRadius: "18px", border: `1.5px solid ${P.border}`, background: "rgba(255,255,255,0.85)", padding: "18px" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: P.text, fontFamily: "sans-serif" }}>📅 Select Date</span>
                        <input type="date" value={appointmentDate}
                          onChange={(e) => { handleStepTouch(2); setAppointmentDate(e.target.value); setAppointmentTime(""); }}
                          style={inputStyle(currentErrors[2] && !appointmentDate)}
                        />
                      </label>

                      <div style={{ borderRadius: "18px", border: `1.5px solid ${P.border}`, background: "rgba(255,255,255,0.85)", padding: "18px" }}>
                        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: P.text, fontFamily: "sans-serif", marginBottom: "12px" }}>⏰ Available Slots</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          {availableSlots.map((slot) => (
                            <button type="button" key={slot}
                              onClick={() => { handleStepTouch(2); setAppointmentTime(slot); }}
                              disabled={!appointmentDate}
                              style={{ borderRadius: "999px", border: appointmentTime === slot ? "none" : `1.5px solid ${P.border}`, background: appointmentTime === slot ? P.grad : "rgba(255,255,255,0.8)", color: appointmentTime === slot ? "#fff" : P.muted, padding: "8px 10px", fontSize: "0.75rem", fontFamily: "sans-serif", fontWeight: 600, cursor: appointmentDate ? "pointer" : "not-allowed", opacity: !appointmentDate ? 0.45 : 1, transition: "all 0.18s" }}
                            >{slot}</button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ borderRadius: "18px", background: "linear-gradient(135deg,#fdf2f8,#fce7f3)", border: `1.5px solid ${P.border}`, padding: "18px 20px" }}>
                      <p style={{ fontSize: "0.7rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: P.pink, marginBottom: "6px" }}>Selected Slot</p>
                      <p style={{ fontSize: "1.05rem", fontWeight: 700, color: P.text }}>{formatDate(appointmentDate) || "No date selected"}</p>
                      <p style={{ fontSize: "0.85rem", color: P.muted, fontFamily: "sans-serif", marginTop: "4px" }}>{appointmentTime || "No time selected"}</p>
                    </div>
                    {currentErrors[2] && <div style={{ marginTop: "14px", borderRadius: "14px", border: "1.5px solid #fca5a5", background: "#fff0f0", padding: "10px 16px", fontSize: "0.85rem", color: "#b91c1c", fontFamily: "sans-serif" }}>Please complete this step to continue.</div>}
                  </div>
                )}

                {/* STEP 3 */}
                {currentStep === 3 && (
                  <div>
                    <span style={{ fontSize: "0.7rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: P.pink }}>Step 3 · Patient Info</span>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: P.text, marginTop: "10px", marginBottom: "8px", letterSpacing: "-0.02em" }}>Tell us about the patient</h2>
                    <p style={{ color: P.muted, fontSize: "0.92rem", fontFamily: "sans-serif", lineHeight: 1.65, marginBottom: "24px" }}>All fields are required to confirm your appointment.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                      {[
                        { name: "fullName", label: "Full Name", type: "text", placeholder: "Enter full name" },
                        { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
                        { name: "email", label: "Email Address", type: "email", placeholder: "name@example.com" },
                        { name: "dateOfBirth", label: "Date of Birth", type: "date", placeholder: "" },
                      ].map((field) => {
                        const hasError = patientTouched[field.name] && !patientInfo[field.name].trim();
                        return (
                          <label key={field.name} style={{ display: "block", borderRadius: "18px", border: `1.5px solid ${P.border}`, background: "rgba(255,255,255,0.85)", padding: "16px" }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: 700, color: P.text, fontFamily: "sans-serif" }}>{field.label} <span style={{ color: P.pink }}>*</span></span>
                            <input name={field.name} type={field.type} value={patientInfo[field.name]} onChange={handlePatientChange} placeholder={field.placeholder} style={inputStyle(hasError)} />
                            {hasError && <p style={{ marginTop: "6px", fontSize: "0.78rem", color: "#b91c1c", fontFamily: "sans-serif" }}>Required.</p>}
                          </label>
                        );
                      })}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                      <label style={{ display: "block", borderRadius: "18px", border: `1.5px solid ${P.border}`, background: "rgba(255,255,255,0.85)", padding: "16px" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: P.text, fontFamily: "sans-serif" }}>Gender <span style={{ color: P.pink }}>*</span></span>
                        <select name="gender" value={patientInfo.gender} onChange={handlePatientChange} style={inputStyle(patientTouched.gender && !patientInfo.gender)}>
                          <option value="">Select gender</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                        {patientTouched.gender && !patientInfo.gender && <p style={{ marginTop: "6px", fontSize: "0.78rem", color: "#b91c1c", fontFamily: "sans-serif" }}>Required.</p>}
                      </label>

                      <label style={{ display: "block", borderRadius: "18px", border: `1.5px solid ${P.border}`, background: "rgba(255,255,255,0.85)", padding: "16px", gridColumn: "1 / -1" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: P.text, fontFamily: "sans-serif" }}>Address <span style={{ color: P.pink }}>*</span></span>
                        <textarea name="address" value={patientInfo.address} onChange={handlePatientChange} placeholder="Enter full address for records" rows={3} style={{ ...inputStyle(patientTouched.address && !patientInfo.address.trim()), resize: "vertical" }} />
                        {patientTouched.address && !patientInfo.address.trim() && <p style={{ marginTop: "6px", fontSize: "0.78rem", color: "#b91c1c", fontFamily: "sans-serif" }}>Required.</p>}
                      </label>
                    </div>

                    {currentErrors[3] && <div style={{ marginTop: "14px", borderRadius: "14px", border: "1.5px solid #fca5a5", background: "#fff0f0", padding: "10px 16px", fontSize: "0.85rem", color: "#b91c1c", fontFamily: "sans-serif" }}>Please complete all fields.</div>}
                  </div>
                )}

                {/* STEP 4 */}
                {currentStep === 4 && (
                  <div>
                    <span style={{ fontSize: "0.7rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: P.pink }}>Step 4 · Payment</span>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: P.text, marginTop: "10px", marginBottom: "8px", letterSpacing: "-0.02em" }}>How would you like to pay?</h2>
                    <p style={{ color: P.muted, fontSize: "0.92rem", fontFamily: "sans-serif", lineHeight: 1.65, marginBottom: "24px" }}>Choose offline payment at the hospital or complete a secure online payment now.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
                      {[{ id: "offline", label: "🏥 Pay at Hospital", desc: "Settle the bill at reception." }, { id: "online", label: "💳 Online Payment", desc: "Pay now via UPI or card." }].map((opt) => (
                        <button key={opt.id} type="button" onClick={() => { handleStepTouch(4); setPaymentMethod(opt.id); }}
                          style={{ borderRadius: "18px", border: paymentMethod === opt.id ? `2px solid ${P.pink}` : `1.5px solid ${P.border}`, background: paymentMethod === opt.id ? "linear-gradient(135deg,#fff0f6,#fce7f3)" : "rgba(255,255,255,0.85)", padding: "18px 16px", textAlign: "left", cursor: "pointer", boxShadow: paymentMethod === opt.id ? `0 6px 20px ${P.shadow}` : "none", transition: "all 0.2s" }}>
                          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: P.text, marginBottom: "6px" }}>{opt.label}</p>
                          <p style={{ fontSize: "0.78rem", color: P.muted, fontFamily: "sans-serif" }}>{opt.desc}</p>
                        </button>
                      ))}
                    </div>

                    {paymentMethod === "online" && (
                      <div style={{ borderRadius: "18px", border: `1.5px solid ${P.border}`, background: "rgba(255,255,255,0.85)", padding: "20px", marginBottom: "20px" }}>
                        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: P.text, fontFamily: "sans-serif", marginBottom: "14px" }}>Online Payment Options</p>
                        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
                          {[{ id: "upi", label: "UPI" }, { id: "card", label: "Debit / Credit Card" }].map((m) => (
                            <button key={m.id} type="button" onClick={() => { handleStepTouch(4); setOnlineMethod(m.id); }} style={onlineMethod === m.id ? pillActive : pillInactive}>{m.label}</button>
                          ))}
                        </div>

                        {onlineMethod === "upi" ? (
                          <div>
                            <p style={{ fontSize: "0.8rem", color: P.muted, fontFamily: "sans-serif", marginBottom: "10px" }}>Select a UPI provider</p>
                            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                              {paymentProviders.map((prov) => (
                                <button key={prov} type="button" onClick={() => { handleStepTouch(4); setUpiProvider(prov); }} style={upiProvider === prov ? pillActive : pillInactive}>{prov}</button>
                              ))}
                            </div>
                            {currentErrors[4] && !upiProvider && <p style={{ marginTop: "10px", fontSize: "0.8rem", color: "#b91c1c", fontFamily: "sans-serif" }}>Please select a UPI provider.</p>}
                          </div>
                        ) : (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            {[{ name: "cardNumber", label: "Card Number", placeholder: "1234 5678 9012 3456" }, { name: "cardExpiry", label: "Expiry", placeholder: "MM/YY" }, { name: "cardCvv", label: "CVV", placeholder: "123" }, { name: "cardName", label: "Cardholder Name", placeholder: "Full name" }].map((f) => {
                              const hasErr = cardTouched[f.name] && !cardInfo[f.name].trim();
                              return (
                                <label key={f.name} style={{ display: "block", borderRadius: "14px", border: `1.5px solid ${P.border}`, background: "#fff", padding: "14px" }}>
                                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: P.text, fontFamily: "sans-serif" }}>{f.label}</span>
                                  <input name={f.name} type={f.name === "cardCvv" ? "password" : "text"} value={cardInfo[f.name]} onChange={handleCardChange} placeholder={f.placeholder} style={inputStyle(hasErr)} />
                                </label>
                              );
                            })}
                            {currentErrors[4] && <p style={{ gridColumn: "1/-1", fontSize: "0.8rem", color: "#b91c1c", fontFamily: "sans-serif" }}>Please fill all card details.</p>}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Booking preview */}
                    <div style={{ borderRadius: "18px", background: "linear-gradient(135deg,#fdf2f8,#fce7f3)", border: `1.5px solid ${P.border}`, padding: "18px 20px" }}>
                      <p style={{ fontSize: "0.7rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: P.pink, marginBottom: "12px" }}>Booking Preview</p>
                      {[["Doctor / Department", selectedDoctor || selectedDepartment], ["Date & Time", `${formatDate(appointmentDate)} · ${appointmentTime}`], ["Payment", paymentSummary]].map(([label, val]) => (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${P.border}`, padding: "8px 0", gap: "8px" }}>
                          <span style={{ fontSize: "0.82rem", color: P.muted, fontFamily: "sans-serif" }}>{label}</span>
                          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: P.text, fontFamily: "sans-serif", textAlign: "right" }}>{val || "—"}</span>
                        </div>
                      ))}
                    </div>

                    {loginMessage && (
                      <div style={{ marginTop: "16px", borderRadius: "16px", border: "1.5px solid #fcd34d", background: "#fffbeb", padding: "18px 20px" }}>
                        <p style={{ fontWeight: 700, color: "#92400e", fontFamily: "sans-serif", marginBottom: "12px" }}>{loginMessage}</p>
                        <button type="button" onClick={handleLoginToConfirm} style={{ ...pillActive, fontSize: "0.85rem" }}>Login to Confirm →</button>
                      </div>
                    )}
                    {submitError && <div style={{ marginTop: "14px", borderRadius: "14px", border: "1.5px solid #fca5a5", background: "#fff0f0", padding: "10px 16px", fontSize: "0.85rem", color: "#b91c1c", fontFamily: "sans-serif" }}>{submitError}</div>}
                  </div>
                )}

                {/* STEP 5 – Success */}
                {currentStep === 5 && (
                  <div>
                    <div style={{ textAlign: "center", padding: "24px 16px 28px" }}>
                      <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: P.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.2rem", margin: "0 auto 20px", boxShadow: `0 12px 36px ${P.shadowXl}` }}>✓</div>
                      <h2 style={{ fontSize: "2rem", fontWeight: 800, color: P.text, letterSpacing: "-0.02em", marginBottom: "10px" }}>Appointment Confirmed!</h2>
                      <p style={{ color: P.muted, fontSize: "0.95rem", fontFamily: "sans-serif", lineHeight: 1.6 }}>A confirmation will be sent to your email shortly. We look forward to caring for you.</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderRadius: "20px", border: `1.5px solid ${P.border}`, background: "rgba(255,255,255,0.85)", padding: "20px", marginBottom: "16px" }}>
                      {[["Booking ID", bookingId], ["Appointment", selectedDoctor || selectedDepartment], ["Date & Time", `${formatDate(appointmentDate)} at ${appointmentTime}`], ["Payment", paymentSummary]].map(([label, val]) => (
                        <div key={label}>
                          <p style={{ fontSize: "0.65rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: P.pink, marginBottom: "4px" }}>{label}</p>
                          <p style={{ fontSize: "0.92rem", fontWeight: 700, color: P.text, fontFamily: "sans-serif" }}>{val}</p>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderRadius: "20px", border: `1.5px solid ${P.border}`, background: "rgba(255,255,255,0.85)", padding: "20px" }}>
                      <p style={{ fontSize: "0.82rem", fontWeight: 700, color: P.text, fontFamily: "sans-serif", marginBottom: "14px" }}>Patient Details</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        {[["Name", patientInfo.fullName], ["Email", patientInfo.email], ["Phone", patientInfo.phone], ["Gender", patientInfo.gender]].map(([label, val]) => (
                          <div key={label} style={{ borderRadius: "12px", background: P.light, border: `1px solid ${P.border}`, padding: "12px 14px" }}>
                            <p style={{ fontSize: "0.65rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted, marginBottom: "4px" }}>{label}</p>
                            <p style={{ fontSize: "0.88rem", fontWeight: 700, color: P.text, fontFamily: "sans-serif" }}>{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                {currentStep < 5 && (
                  <button type="button" onClick={handleBack} disabled={currentStep === 1}
                    style={{ borderRadius: "999px", border: `1.5px solid ${P.border}`, background: "rgba(255,255,255,0.85)", color: P.rose, padding: "12px 28px", fontSize: "0.88rem", fontFamily: "sans-serif", fontWeight: 600, cursor: currentStep === 1 ? "not-allowed" : "pointer", opacity: currentStep === 1 ? 0.45 : 1, transition: "all 0.2s" }}>
                    ← Back
                  </button>
                )}
                {currentStep < 5 && (
                  <button type="button" onClick={handleContinue}
                    disabled={submitting || (currentStep === 1 && !isStepOneValid) || (currentStep === 2 && !isStepTwoValid) || (currentStep === 3 && !isStepThreeValid) || (currentStep === 4 && !isStepFourValid)}
                    style={{ borderRadius: "999px", background: P.grad, color: "#fff", border: "none", padding: "12px 32px", fontSize: "0.88rem", fontFamily: "sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: `0 6px 24px ${P.shadowXl}`, opacity: (submitting || (currentStep === 1 && !isStepOneValid) || (currentStep === 2 && !isStepTwoValid) || (currentStep === 3 && !isStepThreeValid) || (currentStep === 4 && !isStepFourValid)) ? 0.45 : 1, transition: "all 0.2s" }}>
                    {submitting ? "Saving…" : currentStep === 4 ? "Confirm Booking ✓" : "Continue →"}
                  </button>
                )}
                {currentStep === 5 && (
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <button type="button" onClick={() => window.location.reload()} style={{ borderRadius: "999px", background: P.grad, color: "#fff", border: "none", padding: "12px 24px", fontSize: "0.85rem", fontFamily: "sans-serif", fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 18px ${P.shadowXl}` }}>Book Another</button>
                    <button type="button" onClick={() => navigate("/dashboard")} style={{ borderRadius: "999px", border: `1.5px solid ${P.border}`, background: "rgba(255,255,255,0.85)", color: P.rose, padding: "12px 24px", fontSize: "0.85rem", fontFamily: "sans-serif", fontWeight: 600, cursor: "pointer" }}>View Dashboard</button>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <aside style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Image card */}
              <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: `0 16px 48px ${P.shadowXl}`, border: `2px solid ${P.border}`, height: "220px", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(131,24,67,0.5) 100%)", zIndex: 1 }} />
                <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80" alt="Doctor consultation" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", bottom: "16px", left: "16px", zIndex: 2 }}>
                  <p style={{ color: "#fff", fontSize: "1rem", fontWeight: 800, marginBottom: "2px" }}>Expert Doctors</p>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.75rem", fontFamily: "sans-serif" }}>Compassionate care, every visit</p>
                </div>
              </div>

              {/* Booking summary */}
              <div style={{ borderRadius: "24px", background: "linear-gradient(160deg, #4a0020 0%, #831843 60%, #9d174d 100%)", padding: "24px", boxShadow: `0 16px 48px rgba(74,0,32,0.4)`, color: "#fff" }}>
                <p style={{ fontSize: "0.68rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#f9a8d4", marginBottom: "14px" }}>Booking Summary</p>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "18px", lineHeight: 1.3 }}>Your Appointment Details</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[["Selection", selectedDoctor || selectedDepartment || "Not selected", selectedBy === "doctor" ? "Doctor" : "Department"], ["Consult Fee", selectedFeeDisplay, null], ["Date & Time", formatDate(appointmentDate) || "Not selected", appointmentTime || null], ["Patient", patientInfo.fullName || "Not provided", null]].map(([label, val, sub]) => (
                    <div key={label} style={{ borderRadius: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", padding: "12px 14px" }}>
                      <p style={{ fontSize: "0.62rem", fontFamily: "sans-serif", letterSpacing: "0.22em", textTransform: "uppercase", color: "#f9a8d4", marginBottom: "4px" }}>{label}</p>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>{val}</p>
                      {sub && <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", fontFamily: "sans-serif", marginTop: "2px" }}>{sub}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Why HealthNest */}
              <div style={{ borderRadius: "24px", background: "rgba(255,255,255,0.78)", border: `1.5px solid ${P.border}`, padding: "22px", backdropFilter: "blur(12px)" }}>
                <p style={{ fontSize: "0.68rem", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: P.pink, marginBottom: "16px" }}>Why HealthNest?</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {["Guided 4-step booking — clear and simple.", "Real-time slot availability & instant confirmation.", "Secure UPI, card & offline payment options.", "Warm, patient-first design for every visit."].map((item) => (
                    <div key={item} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                      <span style={{ minWidth: "22px", height: "22px", borderRadius: "50%", background: P.grad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: "#fff", fontWeight: 700, marginTop: "1px", flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: "0.83rem", color: P.muted, fontFamily: "sans-serif", lineHeight: 1.55 }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Second image */}
                <div style={{ marginTop: "18px", borderRadius: "16px", overflow: "hidden", height: "130px" }}>
                  <img src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80" alt="Caring nurse" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}