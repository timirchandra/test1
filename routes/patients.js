const express = require("express");
const router = express.Router();
const Patient = require("../models/patientModel");
const { authenticateUser } = require("../utils/authenticateUser");


router.get("/", authenticateUser(["Clerk"]), async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.json({ message: "Server error"});
  }
});


router.post("/", authenticateUser(["Clerk"]), async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res.json(newPatient);
  } catch (error) {
    res.json({ message: "Error creating patient"});
  }
});


router.get("/:id", authenticateUser(["Clerk","Doctor","Nurse","Paramidic"]), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.json({ message: "Error fetching patient"});
  }
});

router.put("/:id", authenticateUser(["Clerk"]), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPatient);
  } catch (error) {
    res.json({ message: "Error updating patient"});
  }
});


router.delete("/:id", authenticateUser(["Clerk"]), async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ message: "Patient deleted" });
  } catch (error) {
    res.json({ message: "Error deleting patient"});
  }
});

module.exports = router;