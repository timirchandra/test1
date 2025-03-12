const mongoose = require("mongoose");

const TreatmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    diagnosis: {
      type: String,
      default: null,
    },
    vitals: {
      temperature: Number,
      bloodPressure: String,
      pulseRate: Number,
    },
    medication:  [String],
    progressReport: String,
    intakeOutput: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Treatment", TreatmentSchema);
