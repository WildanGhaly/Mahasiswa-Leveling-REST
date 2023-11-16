// buyProductController.js

const con = require("../database/database.js");
const util = require("util");
const { buyProduct } = require("../templates/soap_template");
const axios = require('axios');
const { parseString } = require('xml2js');

exports.buyProduct = (req, res) => {
    if (!req.isTokenValid) {
        return res.json({ isLoggedIn: false, username: null });
    }
    
    // const query = "SELECT points FROM users WHERE username = ?";

    console.log("Membeli produk...",            req.username);
    console.log("Produk yang dibeli:",          req.body.productid);
    console.log("Jumlah produk yang dibeli:",   req.body.quantity);
    console.log("Harga produk:",                parseInt(req.body.price) * parseInt(req.body.quantity));

  let username = req.username;
  const query = 'SELECT * FROM users WHERE username = ?';
  con.query(query, [username], function (err, results){
    if (err) {
      throw err;

    } else {
      if (results.length > 0) {
        const userId = results[0].id;
        const xml = util.format(buyProduct.template, userId, req.body.productid, req.body.quantity, parseInt(req.body.price) * parseInt(req.body.quantity));

        axios.post(buyProduct.url, xml, {
          headers: buyProduct.headers
        })
        .then(response => {
          const { data } = response;
    
          parseString(data, (err, result) => {
            if (err) {
              console.error('Error parsing SOAP response:', err);
              throw err;
             
            }
            const returnValue = result['S:Envelope']['S:Body'][0]['ns2:buyProductResponse'][0]['return'][0];
            if (returnValue === '1') {
              res.json({ success: true });
            } else {
              res.json({ success: false, message: "Failed to buy product" });
            }
          })
        });
        

      } 
      else {
        res.json({ success: false, message: "No user found" });
      }
    }
  })
    
    // con.query(query, [req.username], function (err, result, fields) {
    //     if (err) throw err;
    //     if (result.length > 0) { 
    //     if (result[0].points >= req.body.price * req.body.quantity) {
    //         const query = "INSERT INTO history (user_id, product_id, quantity) VALUES ((SELECT id FROM users WHERE username = ?), ?, ?)";
    //         con.query(query, [req.username, req.body.productid, req.body.quantity], function (err, result, fields) {
    //             if (err) throw err;
    //             const query = "UPDATE users SET points = points - ? WHERE username = ?";
    //             con.query(query, [req.body.price * req.body.quantity, req.username], function (err, result, fields) {
    //                 if (err) throw err;
    //                 res.json({ success: true }); 
    //             });
    //         });
    //     } else {
    //         res.json({ success: false });
    //     }
    //     } 
    // } 
    // );
};
 