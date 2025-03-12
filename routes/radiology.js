const express = require('express')
const router = express.Router()
const Radio = require('../models/radioModel')
const { authenticateUser } = require("../utils/authenticateUser");

router.get('/patient/:id',authenticateUser(["Clerk"]), async (req, res) => {
  //Find all entries of a patient
  const radio = await Radio.find({PatientId:req.params.id})
  if (!radio) return res.json({ message: 'Error, radiology not found' })
  res.json(radio)
})

router.get('/:id',authenticateUser(["Clerk"]), async (req, res) => {
  const radio = await Radio.findById(req.params.id)
  if (!radio) return res.json({ message: 'Error, radiology not found' })
  res.json(radio)
})

router.post("/", authenticateUser(["Clerk"]), async (req, res) => {
  try {
    const newRadiology = new Radio(req.body);
    await newRadiology.save();
    res.json(newRadiology);
  } catch (error) {
    res.json({ message: "Error creating patient radiology entry" });
  }
});


router.put('/:id',authenticateUser(["Clerk"]),async (req, res) => {
  try {
    const updatedRadio = await Radio.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updatedRadio) return res.json({ message: 'Error,radiology entry not found' })
    res.json(updatedRadio)
  }
  catch (err) {
    console.log(err)
    return res.json({ message: 'Error adding radiology entry' });
  }
})


router.delete('/:id',authenticateUser(["Clerk"]),async (req, res) => {
  const deletedRadio = await Radio.findByIdAndDelete(req.params.id)
  if (!deletedRadio) return res.json({ message: 'Error, radiology entry not found' })
  res.json({ message: 'Radiology deleted' })
})

module.exports = router