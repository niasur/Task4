const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const authenticateToken = require("../middleware/auth");

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Tambahkan buku baru
 *     description: Menambahkan buku baru ke dalam koleksi buku.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Judul Buku"
 *               author:
 *                 type: string
 *                 example: "Nama Penulis"
 *               year:
 *                 type: integer
 *                 example: 2021
 *               genre:
 *                 type: string
 *                 example: "Fiksi"
 *     responses:
 *       201:
 *         description: Buku berhasil ditambahkan
 *       400:
 *         description: Kesalahan pada input
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Dapatkan semua buku
 *     description: Mengambil daftar semua buku yang tersedia.
 *     responses:
 *       200:
 *         description: Daftar buku berhasil diambil
 *       500:
 *         description: Kesalahan server
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Dapatkan buku berdasarkan ID
 *     description: Mengambil informasi buku berdasarkan ID yang diberikan.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID buku yang ingin diambil
 *     responses:
 *       200:
 *         description: Buku berhasil ditemukan
 *       404:
 *         description: Buku tidak ditemukan
 *       400:
 *         description: Kesalahan pada input
 */

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Perbarui buku berdasarkan ID
 *     description: Memperbarui informasi buku yang sudah ada berdasarkan ID yang diberikan.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID buku yang ingin diperbarui
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Judul Buku Diperbarui"
 *               author:
 *                 type: string
 *                 example: "Nama Penulis Diperbarui"
 *               year:
 *                 type: integer
 *                 example: 2022
 *               genre:
 *                 type: string
 *                 example: "Non-Fiksi"
 *     responses:
 *       200:
 *         description: Buku berhasil diperbarui
 *       404:
 *         description: Buku tidak ditemukan
 *       400:
 *         description: Kesalahan pada input
 */

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Hapus buku berdasarkan ID
 *     description: Menghapus buku berdasarkan ID yang diberikan.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID buku yang ingin dihapus
 *     responses:
 *       200:
 *         description: Buku berhasil dihapus
 *       404:
 *         description: Buku tidak ditemukan
 *       400:
 *         description: Kesalahan pada input
 */

// Menambahkan buku baru
router.post("/", authenticateToken, async (req, res) => {
  const { title, author, year, genre } = req.body;

  // Validasi input
  if (!title || !author || !year || !genre) {
    return res.status(400).json({ message: "Semua field harus diisi." });
  }

  try {
    const newBook = new Book({ title, author, year, genre });
    await newBook.save();
    res.status(201).json({
      message: "Buku berhasil ditambahkan",
      book: newBook,
    });
  } catch (error) {
    res.status(400).json({ message: "Kesalahan pada input: " + error.message });
  }
});

// Mengambil data semua buku
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json({
      message: "Daftar buku berhasil diambil",
      book: books,
    });
  } catch (error) {
    res.status(500).json({ message: "Kesalahan pada server: " + error.message });
  }
});

// Menemukan buku sesuai id 
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.json({
      message: "Buku berhasil ditemukan",
      book : book,
    });
  } catch (error) {
    res.status(400).json({ message: "Kesalahan pada input: " + error.message });
  }
});

// Mengupdate data buku
router.put("/:id", authenticateToken, async (req, res) => {
  const { title, author, year, genre } = req.body;

  // Validasi input
  if (!title || !author || !year || !genre) {
    return res.status(400).json({ message: "Semua field harus diisi." });
  }

  try {
    const book = await Book.findByIdAndUpdate(req.params.id, { title, author, year, genre }, { new: true });
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.json({
      message: "Buku berhasil diperbarui",
      book: book,
    });
  } catch (error) {
    res.status(400).json({ message: "Kesalahan pada input: " + error.message });
  }
});

// Menghapus data buku
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Buku tidak ditemukan" });
    res.json({ message: "Buku dihapus" });
  } catch (error) {
    res.status(400).json({ message: "Kesalahan pada input: " + error.message });
  }
});

module.exports = router;