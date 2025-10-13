const admin = require("../../firebaseConfig");

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access Denied: No Token Provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {uid:decodedToken.uid}; // Attach user data to request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or Expired Token" });
  }
};

module.exports = authenticateUser;
