require('dotenv').config()

const cors = require('cors');
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const mysql = require('mysql2');
const cookieParser = require('cookie-parser');

const mysqlConfig = {
  host: process.env.DB_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

let con = null;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, // Izinkan pengiriman cookie (sesuai dengan withCredentials pada axios)
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

let refreshTokens = []

// Function to generate access token
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
}

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

function connect() {
  if (con) return;
  try {
    con =  mysql.createConnection(mysqlConfig);
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });
  } catch (e) {
    console.log(e);
  }
}

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

// Endpoint for login
app.post('/login', (req, res) => {
  // Authenticate User
  const username = req.body.username
  const password = req.body.password

  connect();
  console.log("Logging in... ", username, password)
  con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (err, result, fields) {
    if (err) throw err;
    if (result.length > 0) {
      const user = { name: username }
      const accessToken = generateAccessToken(user)
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
      refreshTokens.push(refreshToken)
      res.cookie('test', 'hello world', { httpOnly: true, secure: true, sameSite: 'none' });
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
      res.json({ user: user })
    } else {
      res.sendStatus(401)
    } 
  }); 
})

app.post('/register', (req, res) => {
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  connect();
  console.log("Registering... ", username, password) 
  con.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password], function (err, result, fields) {
    if (err) throw err;
    const user = { name: username }
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
    res.cookie('test', 'hello world', { httpOnly: true, secure: true, sameSite: 'none' });
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ user: user })
  });
})

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

  if (!refreshTokens && !accessTokens) {
    console.log('no token');
    isTokenValid = false;
  }

  if (accessTokens) {
    console.log('access token');
    jwt.verify(accessTokens, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      isTokenValid = err ? false : true;
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
      }
    })
  }

  if (!isTokenValid) {
    return res.json({ isLoggedIn: false })
  }
  
  return res.json({ isLoggedIn: true })
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

// Listen on one port
app.listen(8080, () => {
  console.log('Server started on ports 8080');
});
