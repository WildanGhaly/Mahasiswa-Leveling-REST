// topupController.js

const con = require("../database/database.js");
const util = require("util");
const { topup } = require("../templates/soap_template");
const axios = require('axios');
const { parseString } = require('xml2js');

exports.updatePoints = (req, res) => {
  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }
  // const query = "UPDATE users SET points = points + ? WHERE username = ?";
  let username = req.username;
  const amounts = req.body.amount;
  
  // if (typeof amounts !== 'number' || !Number.isInteger(amounts) || amounts > 1000000 || amounts < 0) {
  //   res.json({ success: false, message: "Invalid amount" });
  //   return;
  // }
  
  
  console.log(req.body.amount)
  const query = 'SELECT * FROM users WHERE username = ?';
  con.query(query, [username], function (err, results){
    if (err) {
      throw err;

    } else {
      if (results.length > 0) {
        const userId = results[0].id;
        const email = results[0].email;
        // console.log(userId);
        const xml = util.format(topup.template, userId, req.body.amount, email);
        axios.post(topup.url, xml, {
          headers: topup.headers
        })
        .then(response => {
          const { data } = response;
    
          parseString(data, (err, result) => {
            if (err) {
              console.error('Error parsing SOAP response:', err);
              throw err;
             
            }
            const returnValue = result['S:Envelope']['S:Body'][0]['ns2:topupPointResponse'][0]['return'][0];
            if (returnValue === '1') {
              res.json({ success: true });
            } else {
              res.json({ success: false, message: "Failed to topup" });
            }
          })
        });
        

      } 
      else {
        res.json({ success: false, message: "No user found" });
      }
    }
  })
  
  // con.query(query, [req.body.amount, req.username], function (err, result, fields) {
  //   if (err) throw err;
  //   res.json({ success: true });
  // });

};



