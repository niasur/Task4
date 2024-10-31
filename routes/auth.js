const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config(); 

// Pengguna dummy untuk autentikasi dengan password yang di-hash
const users = [
  { username: "nia", password: bcrypt.hashSync("1234", 10) },
  { username: "sur", password: bcrypt.hashSync("6789", 10) },
  { username: "niati", password: bcrypt.hashSync("5678", 10) },
];

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login ke aplikasi
 *     description: Authenticate user and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: sur
 *               password:
 *                 type: string
 *                 example: 1234
 *     responses:
 *       200:
 *         description: Login berhasil dan mendapatkan token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login berhasil
 *                 token:
 *                   type: string
 *                   example: your_jwt_token_here
 *       400:
 *         description: Permintaan tidak valid, nama pengguna atau kata sandi tidak ada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Username dan password diperlukan.
 *       401:
 *         description: Tidak diizinkan, username dan password salah
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Gagal login
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password diperlukan." });
  }

  const user = users.find((u) => u.username === username);

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || "your_default_secret_key", { expiresIn: "1h" });

    // Mengatur cookie dengan opsi httpOnly dan secure
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.json({ message: "Login berhasil", token });
  } else {
    res.status(401).json({ message: "Gagal login" });
  }
});

module.exports = router;
