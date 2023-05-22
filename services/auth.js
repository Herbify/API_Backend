const jwt = require("jsonwebtoken");

// Fungsi untuk membuat token JWT
async function generateToken(payload) {
  const token = jwt.sign(payload, "herbify-secret-key", { expiresIn: "1h" });
  return token;
}

// Fungsi untuk memverifikasi token JWT
async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, "herbify-secret-key");
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
