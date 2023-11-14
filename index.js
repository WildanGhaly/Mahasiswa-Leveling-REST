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

app.get('/check-status', (req, res) => {
  console.log('check-status');
  const refreshTokens = req.cookies.refreshToken;
  const accessTokens = req.cookies.accessToken;
  res.cookie('test01', 'hello world', { httpOnly: true, secure: true, sameSite: 'none' });

  var isTokenValid = false;
  var username = null;

  if (!refreshTokens && !accessTokens) {
    console.log('no token');
    isTokenValid = false;
  }

  if (accessTokens) {
    console.log('access token');
    jwt.verify(accessTokens, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        isTokenValid = false;
      } else {
        isTokenValid = true;
        username = user.name;
      }
    })
  }

  if (refreshTokens && !isTokenValid) {
    console.log('refresh token');
    jwt.verify(refreshTokens, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        isTokenValid = false;
      } else {
        const accessToken = generateAccessToken({ name: user.name })
        console.log('name', user.name);
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
        isTokenValid = true;
        username = user.name;
      }
    })
  }

  if (!isTokenValid) {
    return res.json({ isLoggedIn: false, username: null })
  }
  
  return res.json({ isLoggedIn: true, username: username })
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

app.get('/user/data', (req, res) => {
  const refreshTokens = req.cookies.refreshToken;
  const accessTokens = req.cookies.accessToken;

  console.log('user/data');
  console.log('refreshTokens', refreshTokens);
  console.log('accessTokens', accessTokens);

  var isTokenValid = false;
  var username = null;

  if (!refreshTokens && !accessTokens) {
    console.log('no token');
    isTokenValid = false;
  }

  if (accessTokens) {
    console.log('access token');
    jwt.verify(accessTokens, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        isTokenValid = false;
      } else {
        isTokenValid = true;
        username = user.name;
      }
    })
  }

  if (refreshTokens && !isTokenValid) {
    console.log('refresh token');
    jwt.verify(refreshTokens, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        isTokenValid = false;
      } else {
        const accessToken = generateAccessToken({ name: user.name })
        console.log('name', user.name);
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
        isTokenValid = true;
        username = user.name;
      }
    })
  }

  if (!isTokenValid) {
    return res.json({ isLoggedIn: false, username: null })
  }


  console.log("Getting user data... ", username)

  con.query('SELECT name, email, points FROM users WHERE username = ?', [username], function (err, result, fields) {
    if (err) throw err;
    if (result.length > 0) {
      res.json({
        username: username,
        name: result[0].name,
        email: result[0].email,
        points: result[0].points
      })
    } else {
      res.sendStatus(401)
    } 
  });

});

app.get('/products', (req, res) => {
  con.query('SELECT * FROM products', function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/merchants', (req, res) => {
  console.log('merchants');
  const refreshTokens = req.cookies.refreshToken;
  const accessTokens = req.cookies.accessToken;

  var isTokenValid = false;
  var username = null;

  if (!refreshTokens && !accessTokens) {
    console.log('no token');
    isTokenValid = false;
  }

  if (accessTokens) {
    console.log('access token');
    jwt.verify(accessTokens, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        isTokenValid = false;
      } else {
        isTokenValid = true;
        username = user.name;
      }
    })
  }

  if (refreshTokens && !isTokenValid) {
    console.log('refresh token');
    jwt.verify(refreshTokens, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        isTokenValid = false;
      } else {
        const accessToken = generateAccessToken({ name: user.name })
        console.log('name', user.name);
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
        isTokenValid = true;
        username = user.name;
      }
    })
  }

  if (!isTokenValid) {
    return res.json({ isLoggedIn: false, username: null })
  }

  const query = "SELECT p.productid AS MerchantID, up.quantity AS MerchantQuantity, p.productname AS MerchantName, p.imagepath AS MerchantImagePath FROM  users u JOIN user_product up ON u.id = up.user_id JOIN products p ON up.product_id = p.productid WHERE u.username = ?"

  con.query(query, [username], function (err, result, fields) {
    if (err) throw err;
    res.json(result);
  });

});

app.post('/topup', (req, res) => {
  console.log('topup');

  const refreshTokens = req.cookies.refreshToken;
  const accessTokens = req.cookies.accessToken;

  var isTokenValid = false;
  var username = null;

  console.log('refreshTokens', refreshTokens);
  console.log('accessTokens', accessTokens);

  if (!refreshTokens && !accessTokens) {
    console.log('no token');
    isTokenValid = false;
  }

  if (accessTokens) {
    console.log('access token');
    jwt.verify(accessTokens, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        isTokenValid = false;
      } else {
        isTokenValid = true;
        username = user.name;
      }
    })
  }

  if (refreshTokens && !isTokenValid) {
    console.log('refresh token');
    jwt.verify(refreshTokens, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        isTokenValid = false;
      } else {
        const accessToken = generateAccessToken({ name: user.name })
        console.log('name', user.name);
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
        isTokenValid = true;
        username = user.name;
      }
    })
  }

  if (!isTokenValid) {
    return res.json({ isLoggedIn: false, username: null })
  }

  const query = "UPDATE users SET points = points + ? WHERE username = ?"

  con.query(query, [req.body.amount, username], function (err, result, fields) {
    if (err) throw err;
    res.json({ success: true });
  });

});

// Listen on one port
app.listen(8080, () => {
  console.log('Server started on ports 8080');
});
