// moneyController.js

const con = require("../database/database.js");
const util = require("util");
const { getCurrency, uangConverter } = require("../templates/soap_template");
const axios = require('axios');
const { parseString } = require('xml2js');

exports.getMoney = (req, res) => {
    if (!req.isTokenValid) {
        return res.json({ isLoggedIn: false, username: null });
    }
    
    let username = req.username;
    const query = 'SELECT * FROM users WHERE username = ?';
    con.query(query, [username], function (err, results){
        if (err) {
        throw err;

        } else {
        if (results.length > 0) {
            const userId = results[0].id;
            const xml = util.format(getCurrency.template, userId, req.body.amount);
            axios.post(getCurrency.url, xml, {
            headers: getCurrency.headers
            })
            .then(response => {
            const { data } = response;
        
            parseString(data, (err, result) => {
                if (err) {
                console.error('Error parsing SOAP response:', err);
                throw err;
                
                }
                const point = result['S:Envelope']['S:Body'][0]['ns2:getCurrencyResponse'][0]['return'][0]['point'][0];
                const uang = result['S:Envelope']['S:Body'][0]['ns2:getCurrencyResponse'][0]['return'][0]['uang'][0];
                res.json({ success: true, 0: {points: point, money: uang }});
            })
            });
            

        } 
        else {
            res.json({ success: false, message: "No user found" });
        }  
         
        }
    })
    // const query1 = `
    //     SELECT points as points, points as money 
    //     FROM users 
    //     WHERE username = ?`;

    
    // console.log("Mengambil data uang...", req.username);
    
    // con.query(query1, [req.username], function (err, result, fields) {
    //     if (err) throw err;
    //     console.log((result));
    //     res.json(result);
    // });
    };

exports.convertMoney = (req, res) => {
    if (!req.isTokenValid) {
        return res.json({ isLoggedIn: false, username: null });
    }
    
    let username = req.username;
    const query = 'SELECT * FROM users WHERE username = ?';
    con.query(query, [username], function (err, results){
        if (err) {
        throw err;

        } else {
            if (results.length > 0) {
                const userId = results[0].id;
                const xml = util.format(uangConverter.template, userId, req.body.amount);
                console.log(xml);
                axios.post(uangConverter.url, xml, {
                  headers: uangConverter.headers
                })
                .then(response => {
                  const { data } = response;
            
                  parseString(data, (err, result) => {
                    if (err) {
                      console.error('Error parsing SOAP response:', err);
                      throw err;
                     
                    }
                    const returnValue = result['S:Envelope']['S:Body'][0]['ns2:uangConverterResponse'][0]['return'][0];
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
            // res.json({ success: true });
            // TODO convert moneyy
        }
    }
    )
    
};