const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { authenticateUser } = require("../utils/authenticateUser");

const JWT_SECRET = process.env.JWT_SECRET;

// Get all users
router.get("/",authenticateUser(["Technical staff"]), async (req, res) => {
  const users = await User.find().select("-Password");
  res.json(users);
});

// Create a new user
router.post("/",authenticateUser(["Technical staff"]), async (req, res) => {
  try{
    
    //Check if username already exists
    const existing= await User.findOne({ Username: req.body.Username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    //Encrypt Password
    req.body.Password = crypto
    .createHash("md5")
    .update(req.body.Password)
    .digest("hex");
    const newUser = new User(req.body);
    await newUser.save();
    //Return User without password
    newUser.Password = undefined;
    res.json(newUser);
  }
  catch(err){
    //res.json({error:err.message});
    res.json({message:"An error occured."});
  }
});

// Get a single user by ID
router.get("/:id", authenticateUser(["Technical staff"]),async (req, res) => {
  const user = await User.findById(req.params.id).select("-Password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

//User Login (Returns JWT)
router.post("/login", async (req, res) => {
  const hashedPassword = crypto
    .createHash("md5")
    .update(req.body.Password)
    .digest("hex");
  const user = await User.findOne({
    Username: req.body.Username,
    Password: hashedPassword,
  });

  if (!user)
    return res.status(404).json({ message: "Invalid username or password" });

  // Generate JWT Token (Includes userId & role)
  const token = jwt.sign(
    { userId: user._id, username: user.Username, role: user.Role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    userId: user._id,
    username: user.Username,
    role: user.Role,
  });
});

// Update Password a user by ID
router.put("/change-password/:id",authenticateUser(["Technical staff"]), async (req, res) => {
  try {
    const { OldPassword, NewPassword } = req.body;

    // Find user by ID
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify old password
    const hashedOldPassword = crypto.createHash("md5").update(OldPassword).digest("hex");
    if (user.Password !== hashedOldPassword) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = crypto.createHash("md5").update(NewPassword).digest("hex");

    // Update password in the database
    user.Password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.json({ message:"Operation failed" });
  }
});


// Delete a user by ID
router.delete("/:id",authenticateUser(["Technical staff"]), async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
});

module.exports = router;