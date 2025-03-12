const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    Name: String,
    Username: String,
    Password: String,
    Role: {
      type: String,
      enum: ["Doctor", "Nurse", "Paramedic", "Clerk", "Technical staff"],
      required: true,
    },
  },
  { collection: "Users" }
);

module.exports = mongoose.model("User", userSchema);