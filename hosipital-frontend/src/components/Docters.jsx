
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const departments = [
  {
    name: "Cardiology",
    description: "Dil ki poori dekhbhal — expert cardiologists aur advanced diagnostics ke saath.",
    key: "Cardiology",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pediatrics",
    description: "Bacchon aur nawajaaton ke liye gentle, family-centered treatment.",
    key: "Pediatrics",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Orthopedics",
    description: "Haddi, joint aur sports medicine care tezi se theek hone ke liye.",
    key: "Orthopedics",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Radiology",
    description: "Sahi diagnosis ke liye high-quality imaging services.",
    key: "Radiology",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Neurology",
    description: "Complex neurological conditions ke liye advanced brain aur nervous system care.",
    key: "Neurology",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dermatology",
    description: "Healthy, glowing skin ke liye skin aur cosmetic care.",
    key: "Dermatology",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Oncology",
    description: "Multidisciplinary treatment planning ke saath cancer care aur precision therapy.",
    key: "Oncology",
    image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Gastroenterology",
    description: "Liver, stomach aur intestinal conditions ke liye digestive health services.",
    key: "Gastroenterology",
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Ophthalmology",
    description: "Advanced diagnostic imaging ke saath vision care aur eye surgery services.",
    key: "Ophthalmology",
    image: "https://images.unsplash.com/photo-1607687781562-d8b1a2a5c4a1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Pulmonology",
    description: "Breathing disorders ke specialized treatment ke saath lung aur respiratory care.",
    key: "Pulmonology",
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80",
  },
];

// All doctor images use stable Unsplash URLs (seed-based = always same image per doctor)
const doctorsByDepartment = {
  Cardiology: [
    { name: "Dr. Neha Sharma", fee: "₹850", image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop&crop=face" },
    { name: "Dr. Arjun Singh", fee: "₹900", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face" },
    { name: "Dr. Satish Malik", fee: "₹780", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face" },
    { name: "Dr. Pooja Rao", fee: "₹920", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face" },
  ],
  Pediatrics: [
    { name: "Dr. Disha", fee: "₹750", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face" },
    { name: "Dr. Rahul Verma", fee: "₹700", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face" },
    { name: "Dr. Siya Gupta", fee: "₹730", image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop&crop=face" },
    { name: "Dr. Nikhil Mehta", fee: "₹760", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face" },
  ],
  Orthopedics: [
    { name: "Dr. Meera Bhat", fee: "₹880", image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=face" },
    { name: "Dr. Vikram Patel", fee: "₹910", image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=face" },
    { name: "Dr. Varshu", fee: "₹870", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=faces&facepad=3" },
    { name: "Dr. Kabir Iqbal", fee: "₹940", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=faces&facepad=4" },
  ],
  Radiology: [
    { name: "Dr. Priya Reddy", fee: "₹820", image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop&crop=faces&facepad=3" },
    { name: "Dr. Karan Joshi", fee: "₹860", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=faces&facepad=4" },
    { name: "Dr. Neeta Shah", fee: "₹800", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=faces&facepad=3" },
    { name: "Dr. Tarun Nair", fee: "₹850", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=faces&facepad=4" },
  ],
  Neurology: [
    { name: "Dr. Kavita Iyer", fee: "₹950", image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop&crop=faces&facepad=3" },
    { name: "Dr. Rajesh Nair", fee: "₹930", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=faces&facepad=4" },
    { name: "Dr. Meenakshi Bhagat", fee: "₹880", image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=faces&facepad=3" },
    { name: "Dr. Sameer Kulkarni", fee: "₹940", image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=faces&facepad=3" },
  ],
  Dermatology: [
    { name: "Dr. Akshu", fee: "₹780", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=faces&facepad=5" },
    { name: "Dr. Nisha Kapoor", fee: "₹820", image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop&crop=faces&facepad=5" },
    { name: "Dr. Aarti Mehta", fee: "₹790", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=faces&facepad=5" },
    { name: "Dr. Anil Joshi", fee: "₹810", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=faces&facepad=5" },
  ],
  Oncology: [
    { name: "Dr. Kavita Singh", fee: "₹980", image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop&crop=faces&facepad=5" },
    { name: "Dr. Anurag Desai", fee: "₹990", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=faces&facepad=5" },
    { name: "Dr. Nidhi Singh", fee: "₹970", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=faces&facepad=5" },
    { name: "Dr. Rohan Mehta", fee: "₹940", image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=faces&facepad=5" },
  ],
  Gastroenterology: [
    { name: "Dr. Meera Kapoor", fee: "₹860", image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=faces&facepad=5" },
    { name: "Dr. Sanjay Agarwal", fee: "₹820", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=faces&facepad=5" },
    { name: "Dr. Nitya Joshi", fee: "₹850", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=faces&facepad=6" },
    { name: "Dr. Vikram Sharma", fee: "₹880", image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=faces&facepad=6" },
  ],
  Ophthalmology: [
    { name: "Dr. Anjali Rao", fee: "₹840", image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop&crop=faces&facepad=6" },
    { name: "Dr. Varun Shah", fee: "₹850", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=faces&facepad=6" },
    { name: "Dr. Reema Patel", fee: "₹820", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=faces&facepad=6" },
    { name: "Dr. Nikhil Gupta", fee: "₹860", image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=faces&facepad=6" },
  ],
  Pulmonology: [
    { name: "Dr. Priya Mehra", fee: "₹840", image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&h=400&fit=crop&crop=faces&facepad=7" },
    { name: "Dr. Arjun Mehta", fee: "₹860", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=faces&facepad=7" },
    { name: "Dr. Sanya Kapoor", fee: "₹820", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=faces&facepad=7" },
    { name: "Dr. Karan Bhatia", fee: "₹870", image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=faces&facepad=7" },
  ],
};

export default function Departments() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 pt-16 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-2 sm:px-3 md:px-4 lg:px-6 py-12">

        {/* Hero — image left, text right */}
        <section className="relative rounded-[32px] bg-gradient-to-r from-pink-700 to-rose-400 px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-14 text-white shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-rose-400/20" />
          <p className="relative text-sm uppercase tracking-[0.3em] text-pink-200 mb-6">HealthNest — Vibhag</p>
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-center">
            {/* Image on left */}
            <div className="relative flex items-start justify-start">
              <div className="relative overflow-hidden rounded-[32px] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl w-full">
                <img
                  src="https://images.stockcake.com/public/4/5/4/454958fc-f583-45b4-9162-80aed15fef78_large/medical-team-working-stockcake.jpg"
                  alt="Healthcare team working"
                  className="h-72 w-full rounded-[28px] object-cover shadow-xl"
                />
                <div className="absolute inset-x-0 bottom-0 rounded-b-[28px] bg-gradient-to-t from-slate-950/80 to-transparent p-4 text-white">
                  <p className="text-sm uppercase tracking-[0.3em] pl-6 text-pink-200">Bharosemand care</p>
                  <p className="mt-2 text-2xl pl-6 font-semibold">Dekhbhal karne wali team se milein</p>
                </div>
              </div>
            </div>
            {/* Text on right */}
            <div>
              <div className="flex items-center gap-6">
                <img
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=200&q=80"
                  alt="Medical care icon"
                  className="h-16 w-16 rounded-full object-cover shadow-lg"
                />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Har specialty mein expert care.</h1>
              </div>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-pink-100">
                Un vibhagon ko jaanein jo aapki health journey ko support karte hain — preventive checkups se lekar
                advanced treatments tak. Har team modern tools aur insaani approach ke saath excellent care dene ke liye taiyaar hai.
              </p>
            </div>
          </div>
        </section>

        {/* Department cards */}
        <section className="mt-12 grid gap-6 sm:gap-8 lg:grid-cols-2">
          {departments.map((department) => (
            <div
              key={department.name}
              className="group w-full rounded-[32px] border border-slate-200 bg-white overflow-hidden shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={department.image}
                  alt={department.name}
                  className="w-full h-full object-cover transition group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4">
                  <button
                    onClick={() => setSelectedDepartment(department.key)}
                    className="rounded-full bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white"
                  >
                    Doctors dekhen
                  </button>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-3xl font-semibold text-slate-900">{department.name}</h2>
                <p className="mt-4 text-slate-600">{department.description}</p>
                <button
                  type="button"
                  onClick={() => navigate(`/appointments?department=${encodeURIComponent(department.key)}`)}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-pink-600 px-3 sm:px-4 md:px-5 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                >
                  Abhi Book Karein
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Feature cards */}
        <section className="mt-12 grid gap-6 sm:gap-8 lg:grid-cols-3">
          {[
            {
              title: "Same-day appointments",
              detail: "Har vibhag mein specialists ke saath consultations jaldi book karein.",
              icon: "📅",
            },
            {
              title: "Integrated care teams",
              detail: "Hamare specialists milkar vyaktigat treatment plans banate hain.",
              icon: "👥",
            },
            {
              title: "Diagnostic excellence",
              detail: "Modern imaging aur lab services tez aur sahi medical decisions ko support karti hain.",
              icon: "🔬",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-[32px] bg-slate-900 p-6 sm:p-8 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl">
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-2xl font-semibold">{card.title}</h3>
              <p className="mt-4 text-slate-200">{card.detail}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Doctor modal */}
      {selectedDepartment && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 px-2 sm:px-3 md:px-4 lg:px-6 py-10"
          onClick={() => setSelectedDepartment(null)}
        >
          <div
            className="mx-auto max-w-6xl rounded-[40px] bg-white p-4 sm:p-6 md:p-8 shadow-2xl ring-1 ring-slate-200"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 flex items-center justify-center text-white text-xl">
                  👨‍⚕️
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{selectedDepartment}</p>
                  <h2 className="mt-2 text-4xl font-bold text-slate-900">{selectedDepartment} team se milein</h2>
                  <p className="mt-4 max-w-2xl text-slate-600">
                    Hamare experienced specialists mein se chunein. Har doctor advanced diagnostics aur patient-focused care se supported hai.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {doctorsByDepartment[selectedDepartment].map((doctor) => (
                <div key={doctor.name} className="overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <img src={doctor.image} alt={doctor.name} className="h-44 w-full object-cover" />
                  <div className="p-4 sm:p-5">
                    <h3 className="text-xl font-semibold text-slate-900">{doctor.name}</h3>
                    <p className="mt-3 text-sm uppercase tracking-[0.2em] text-slate-500">{selectedDepartment}</p>
                    <p className="mt-4 text-slate-700">Consultation fee: <span className="font-semibold text-slate-900">{doctor.fee}</span></p>
                    <button
                      className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-pink-600 px-3 sm:px-4 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                      onClick={() => navigate(`/appointments?doctor=${encodeURIComponent(doctor.name)}&department=${encodeURIComponent(selectedDepartment)}&fee=${encodeURIComponent(doctor.fee)}`)}
                    >
                      Abhi Book Karein
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}