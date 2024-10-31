const mongoose = require("mongoose");

// Mendefinisikan skema untuk Buku
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true }, 
  author: { type: String, required: true }, 
  year: { type: Number, required: true },
  genre: { type: String, required: true }, 
});

// Membuat model dari skema yang didefinisikan
const Book = mongoose.model("Book", bookSchema);

// Mengeksport model untuk digunakan di file lain
module.exports = Book;