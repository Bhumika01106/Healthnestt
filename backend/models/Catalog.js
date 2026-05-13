import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true },
    department:     { type: String, required: true },
    specialization: { type: String, default: "" },
    fee:            { type: String, default: "₹499" },
    image:          { type: String, default: "" },
    available:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

const departmentSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    icon:        { type: String, default: "" },
  },
  { timestamps: true }
);

export const Doctor     = mongoose.model("Doctor",     doctorSchema);
export const Department = mongoose.model("Department", departmentSchema);
