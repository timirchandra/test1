const mongoose = require("mongoose");

const ReferralSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  department: {
    type: String,
    enum: [
      "Cardiology",
      "Neurology",
      "Oncology",
      "Radiology",
      "Physiotherapy",
      "Surgery",
      "Blood Bank",
      "ICU",
      "CCU",
      "Operation Theatre",
      "Pathology",
      "Ward"
    ],
    required: true,
  },
  reason: { type: String, required: true },
  referralDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Pending", "Approved", "In Progress", "Completed", "Rejected"], default: "Pending" },
});

module.exports = mongoose.model("Referral", ReferralSchema);
