require("dotenv").config();

const cors            = require("cors");
const express         = require("express");
const app             = express();
const cookieParser    = require("cookie-parser");
const con             = require("./database/database.js");

const authController  = require("./routes/authRoutes.js");
const userRoutes      = require("./routes/userRoutes");
const tokenRoutes     = require("./routes/tokenRoutes");
const { checkToken }  = require("./middleware/authMiddleware");
const merchantRoutes  = require("./routes/merchantRoutes.js");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // Izinkan pengiriman cookie (sesuai dengan withCredentials pada axios)
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));


// Menggunakan middleware untuk memeriksa token pada '/check-status'

app.use("/user",      userRoutes);
app.use("/auth",      authController);
app.use("/token",     tokenRoutes);
app.use("/merchants", merchantRoutes);

// Endpoint '/products'
app.get("/products", (req, res) => {
  con.query("SELECT * FROM products", function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

// Endpoint '/topup'
app.post("/topup", checkToken, (req, res) => {
  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }

  const query = "UPDATE users SET points = points + ? WHERE username = ?";

  con.query(
    query,
    [req.body.amount, req.username],
    function (err, result, fields) {
      if (err) throw err;
      res.json({ success: true });
    }
  );
});

// Endpoint '/history'
app.get("/history", checkToken, (req, res) => {
  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }

  const query = `
    SELECT h.history_id as HistoryID, h.quantity as HistoryQuantity,
           p.productname as HistoryProductName, h.timestamp as HistoryDate,
           p.imagepath as HistoryImagePath
    FROM users u
    JOIN history h ON u.id = h.user_id
    JOIN products p ON p.productid = h.product_id
    WHERE username = ?`;

  con.query(query, [req.username], function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

// Listen on one port
app.listen(8080, () => {
  console.log("Server started on ports 8080");
});
