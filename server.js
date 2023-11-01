const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Memuat variabel lingkungan dari berkas .env
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

// Middleware untuk memproses body dari permintaan POST
app.use(express.json());

app.get('/challenge', (req, res) => {
  db.query('SELECT * FROM challenge', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ pesan: 'Terjadi kesalahan dalam database' });
    } else {
      res.json(results);
    }
  });
});

app.get('/challenge/:id', (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM challenge WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ pesan: 'Terjadi kesalahan dalam database' });
    } else if (results.length === 0) {
      res.status(404).json({ pesan: 'Challenge tidak ditemukan' });
    } else {
      res.json(results[0]);
    }
  });
});

// ... Endpoint-endpoint lainnya (POST, PUT, DELETE) dengan menggunakan koneksi ke database

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
