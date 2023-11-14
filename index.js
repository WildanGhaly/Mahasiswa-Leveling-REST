require('dotenv').config()

const cors = require('cors');
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const con = require('./database.js');
const { generateAccessToken, authenticateToken } = require('./auth.js');

const authController = require('./controllers/authController');

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, // Izinkan pengiriman cookie (sesuai dengan withCredentials pada axios)
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

let refreshTokens = []

// Membuat middleware untuk memeriksa token
function checkToken(req, res, next) {
  const refreshTokens = req.cookies.refreshToken;
  const accessTokens = req.cookies.accessToken;

  var isTokenValid = false;
  var username = null;

  if (accessTokens) {
    jwt.verify(accessTokens, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (!err) {
        isTokenValid = true;
        username = user.name;
      }
    });
  }

  if (!isTokenValid && refreshTokens) {
    jwt.verify(refreshTokens, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (!err) {
        const accessToken = generateAccessToken({ name: user.name });
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
        isTokenValid = true;
        username = user.name;
      }
    });
  }

  req.isTokenValid = isTokenValid;
  req.username = username;
  next();
}

// Menggunakan middleware untuk memeriksa token pada '/check-status'
app.get('/check-status', checkToken, (req, res) => {
  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }

  return res.json({ isLoggedIn: true, username: req.username });
});

// Menggunakan middleware untuk memeriksa token pada '/user/data'
app.get('/user/data', checkToken, (req, res) => {
  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }

  console.log("Mengambil data pengguna...", req.username);

  con.query('SELECT name, email, points FROM users WHERE username = ?', [req.username], function (err, result, fields) {
    if (err) throw err;
    if (result.length > 0) {
      res.json({
        username: req.username,
        name: result[0].name,
        email: result[0].email,
        points: result[0].points
      });
    } else {
      res.sendStatus(401);
    } 
  });
});


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

app.use(authController); 

// Endpoint to refresh token
app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

// Endpoint to logout
app.delete('/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.sendStatus(204);
})

app.get('/cookie', (req, res) => {
  res.cookie('jwt', 'hello world', { httpOnly: true, secure: true, sameSite: 'none' });
  res.cookie('refreshToken', 'hello world', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ message: 'cookie set' });
});

app.get('/products', (req, res) => {
  con.query('SELECT * FROM products', function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

// Endpoint '/merchants'
app.get('/merchants', checkToken, (req, res) => {
  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }

  const query = `
    SELECT p.productid AS MerchantID, up.quantity AS MerchantQuantity,
           p.productname AS MerchantName, p.imagepath AS MerchantImagePath
    FROM users u
    JOIN user_product up ON u.id = up.user_id
    JOIN products p ON up.product_id = p.productid
    WHERE u.username = ?`;

  con.query(query, [req.username], function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

// Endpoint '/topup'
app.post('/topup', checkToken, (req, res) => {
  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }

  const query = "UPDATE users SET points = points + ? WHERE username = ?";

  con.query(query, [req.body.amount, req.username], function (err, result, fields) {
    if (err) throw err;
    res.json({ success: true });
  });
});

// Endpoint '/history'
app.get('/history', checkToken, (req, res) => {
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
  console.log('Server started on ports 8080');
});
