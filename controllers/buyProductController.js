// buyProductController.js

const con = require("../database/database.js");

exports.buyProduct = (req, res) => {
    if (!req.isTokenValid) {
        return res.json({ isLoggedIn: false, username: null });
    }
    
    const query = "SELECT points FROM users WHERE username = ?";

    console.log("Membeli produk...",            req.username);
    console.log("Produk yang dibeli:",          req.body.productid);
    console.log("Jumlah produk yang dibeli:",   req.body.quantity);
    console.log("Harga produk:",                req.body.price);
    
    con.query(query, [req.username], function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0) { 
        if (result[0].points >= req.body.price * req.body.quantity) {
            const query = "INSERT INTO history (user_id, product_id, quantity) VALUES ((SELECT id FROM users WHERE username = ?), ?, ?)";
            con.query(query, [req.username, req.body.productid, req.body.quantity], function (err, result, fields) {
                if (err) throw err;
                const query = "UPDATE users SET points = points - ? WHERE username = ?";
                con.query(query, [req.body.price * req.body.quantity, req.username], function (err, result, fields) {
                    if (err) throw err;
                    res.json({ success: true }); 
                });
            });
        } else {
            res.json({ success: false });
        }
        } 
    } 
    );
};
 