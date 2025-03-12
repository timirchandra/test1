const express = require("express");
const router = express.Router();
const Referral = require("../models/referralModel");
const { authenticateUser } = require("../utils/authenticateUser");



//Create a New Referral (Only Doctors)
router.post("/", authenticateUser(["Doctor"]), async (req, res) => {
  if (req.userRole.toLowerCase() !== "doctor") {
    return res
      .status(403)
      .json({ message: "Access Denied: Only Doctors can refer patients." });
  }
  try {
    const { patientId, department, reason } = req.body;

    if (!patientId || !department || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newReferral = new Referral({
      patientId,
      doctorId: req.userId,
      department,
      reason,
    });

    await newReferral.save();
    res.status(201).json(newReferral);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get All Referrals 
router.get("/", authenticateUser(["Doctor","Nurse", "Paramedic", "Clerk"]),async (req, res) => {
  try {
    const referrals = await Referral.find().populate(
      "patientId doctorId",
      "Name Username"
    );
    res.json(referrals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Referral by Referral ID
router.get("/:id", authenticateUser(["Doctor","Nurse", "Paramedic", "Clerk"]),async (req, res) => {
  const referral = await Referral.findById(req.params.id).populate(
    "patientId doctorId",
    "Name Username"
  );
  res.json(referral);
});

// Get Referrals by Patient ID
router.get("/patient/:patientId",authenticateUser(["Doctor","Nurse", "Paramedic", "Clerk"]), async (req, res) => {
  const referrals = await Referral.find({
    patientId: req.params.patientId,
  }).populate("patientId doctorId", "Name Username");
  res.json(referrals);
});

// Update a Referral (Only Doctors)
router.put("/:id", authenticateUser(["Doctor"]), async (req, res) => {
  if (req.userRole.toLowerCase() !== "doctor") {
    return res
      .status(403)
      .json({ message: "Access Denied: Only Doctors can update referrals." });
  }

  try {
    const { department, reason } = req.body;
    const updatedReferral = await Referral.findByIdAndUpdate(
      req.params.id,
      { department, reason },
      { new: true }
    );
    res.json(updatedReferral);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating referral", error: error.message });
  }
});



module.exports = router;
