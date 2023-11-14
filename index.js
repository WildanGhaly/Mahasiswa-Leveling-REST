require("dotenv").config();

const cors            = require("cors");
const express         = require("express");
const app             = express();
const cookieParser    = require("cookie-parser");

const authController  = require("./routes/authRoutes.js");
const userRoutes      = require("./routes/userRoutes");
const tokenRoutes     = require("./routes/tokenRoutes");
const merchantRoutes  = require("./routes/merchantRoutes.js");
const productRoutes   = require("./routes/productRoutes.js");
const topupRoutes     = require("./routes/topupRoutes.js");
const historyRoutes   = require("./routes/historyRoutes.js");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // Izinkan pengiriman cookie (sesuai dengan withCredentials pada axios)
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/user",      userRoutes);
app.use("/auth",      authController);
app.use("/token",     tokenRoutes);
app.use("/merchants", merchantRoutes);
app.use("/products",  productRoutes);
app.use("/topup",     topupRoutes);
app.use("/history",   historyRoutes);

// Listen on one port
app.listen(8080, () => {
  console.log("Server started on ports 8080");
});
