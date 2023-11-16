// moneyController.js

const con = require("../database/database.js");

exports.getMoney = (req, res) => {
    if (!req.isTokenValid) {
        return res.json({ isLoggedIn: false, username: null });
    }
    
    const query = `
        SELECT points as points, points as money 
        FROM users 
        WHERE username = ?`;
    
    console.log("Mengambil data uang...", req.username);
    
    con.query(query, [req.username], function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
    };