const jwt = require("jsonwebtoken");


const authenticateUser = (allowedRoles = []) => (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    req.userId = decoded.userId; 
    req.userRole = decoded.role;

  if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: `Access denied. You must be a ${allowedRoles.join(", ")}.` });
  }

    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = { authenticateUser };