import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorName:      { type: String, default: "" },
    department:      { type: String, default: "" },
    date:            { type: String, required: true },
    time:            { type: String, required: true },
    fee:             { type: String, default: "Starting ₹499" },
    paymentMethod:   { type: String, enum: ["online", "offline"], default: "offline" },
    paymentProvider: { type: String, default: "" },
    paymentStatus:   { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    status:          { type: String, enum: ["upcoming", "completed", "cancelled"], default: "upcoming" },
    patient: {
      fullName:    { type: String, required: true },
      email:       { type: String, required: true },
      phone:       { type: String, required: true },
      dateOfBirth: { type: String, default: "" },
      gender:      { type: String, default: "" },
      address:     { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
