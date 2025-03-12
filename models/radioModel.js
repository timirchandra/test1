const mongoose = require('mongoose')

const radioSchema = new mongoose.Schema({
  
  PatientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true 
  },
  RadiologyResult: String,
  RadiologyDate: { type: Date, required: true },
}, { collection: 'Radiologies' })

module.exports = mongoose.model('Radiology', radioSchema)
