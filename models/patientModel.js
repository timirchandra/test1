const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema(
    {
      Name: { type: String, required: true },
      DateOfBirth: { type: Date, required: true },
      EID: String,
      Gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true
      },
      Address: String,
      Phone: { type: String, required: true },
      Email: String,
      BloodType: String,
      Allergies: String,
      EmergencyContact: String,
      InsuranceNumber: String,
      InsuranceCompany: String,
      //Complaints: { type: String, required: true },
      PreviousDisease: String,
      /*department: {
        type: String,
        enum: ["OPD", "A&E", "Wards"],
        required: true,
      },
      ward: {
        type: String,
        required: function () {
          return this.department === "Wards";
        },
      },*/
    },
    { collection: "Patients" }
  );

module.exports = mongoose.model('Patient', patientSchema)