const express = require('express')
const router = express.Router()
const Radio = require('../models/radioModel')
const { authenticateUser } = require("../utils/authenticateUser");

router.get('/patient/:id', authenticateUser(["Clerk"]), async (req, res) => {
    const authHeader = req.header("Authorization");
    const data = await fetch(`http://localhost:3000/radiology/patient/${req.params.id}`, { headers: { "Authorization": authHeader } }).catch(e => console.log("Error:  ", e))
    const radio = await data.json();
    if (!radio) return res.json({ message: 'Error, radiology not found' })
    res.json(radio)
})

module.exports = router