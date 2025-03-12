const express = require("express");
const router = express.Router();
const Treatment = require("../models/treatmentModel");
const { authenticateUser } = require("../utils/authenticateUser");

// Create a new patient treatment record
router.post("/", authenticateUser(["Doctor", "Nurse"]), async (req, res) => {
  try {
    const {
      patientId,
      vitals,
      medication,
      progressReport,
      intakeOutput,
      diagnosis,
    } = req.body;

    if (!patientId || !vitals || !medication) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Nurses cannot enter diagnosis or progress reports
    if (req.userRole === "Nurse" && (progressReport || diagnosis)) {
      return res.status(403).json({
        message: "Nurses cannot record diagnosis or progress reports",
      });
    }

    const newTreatment = new Treatment({
      patientId,
      recordedBy: req.userId,
      diagnosis: req.userRole === "Doctor" ? diagnosis : null,
      vitals,
      medication,
      progressReport: req.userRole === "Doctor" ? progressReport : null,
      intakeOutput,
    });

    await newTreatment.save();
    res.json(newTreatment);
  } catch (error) {
    res.status(500).json({ error : error.message });
  }
});

// Get all treatments for a specific patient
router.get("/:patientId", async (req, res) => {
  try {
    const treatments = await Treatment.find({
      patientId: req.params.patientId,
    }).populate("recordedBy", "name role");
    if (!treatments.length)
      return res.status(400).json({ message: "No records found" });
    res.json(treatments);
  } catch (error) {
    res.status(400).json({ message: "Error processing request" });
  }
});

// Update a treatment record (only by doctors or nurse)
router.put("/:id", authenticateUser(["Doctor", "Nurse"]), async (req, res) => {
  try {
    const { vitals, medication, progressReport, intakeOutput, diagnosis } =
      req.body;
    const treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      return res.status(400).json({ message: "Record not found" });
    }

    // Restrict updates based on user role
    if (req.userRole === "Nurse" && (progressReport || diagnosis)) {
      return res.status(403).json({
        message: "Nurses cannot update diagnosis or progress reports",
      });
    }

    if (
      treatment.recordedBy.toString() !== req.userId &&
      req.userRole !== "Doctor"
    ) {
      return res.status(403).json({ message: "Access Denied" });
    }

    if (req.userRole === "Doctor") {
      treatment.diagnosis = diagnosis || treatment.diagnosis;
      treatment.progressReport = progressReport || treatment.progressReport;
    }

    treatment.vitals = vitals || treatment.vitals;
    treatment.medication = medication || treatment.medication;
    treatment.intakeOutput = intakeOutput || treatment.intakeOutput;

    await treatment.save();
    res.json(treatment);
  } catch (error) {
    res.status(400).json({ message: "Error processing request" });
  }
});

// Delete a treatment record (Only doctors)
router.delete("/:id", authenticateUser(["Doctor"]), async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment)
      return res.status(400).json({ message: "Record not found" });

    if (req.userRole.toLowerCase() !== "doctor") {
      return res.status(400).json({ message: "Access Denied" });
    }

    await Treatment.findByIdAndDelete(req.params.id);
    res.json({ message: "Record deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error processing request" });
  }
});

// Get discharge summary and home treatment plan
router.post(
  "/discharge/:patientId",
  authenticateUser(["Doctor"]),
  async (req, res) => {
    if (req.userRole.toLowerCase() !== "doctor") {
      return res
        .status(403)
        .json({ message: "Only doctors can finalize discharge summaries" });
    }

    const treatment = await Treatment.findOne({
      patientId: req.params.patientId,
    })
      .sort({ createdAt: -1 })
      .populate("recordedBy", "name");

    if (!treatment) {
      return res.status(400).json({ message: "No treatment records found" });
    }

    treatment.dischargeSummary = `Final Diagnosis: ${treatment.diagnosis}\nMedications: ${treatment.medication}\nDoctor: ${treatment.recordedBy.name}`;
    await treatment.save();

    res.json({ message: "Discharge summary finalized", treatment });
  }
);

module.exports = router;
