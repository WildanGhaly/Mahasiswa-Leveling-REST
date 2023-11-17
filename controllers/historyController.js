// historyController.js

const con = require("../database/database.js");
const util = require("util");
const { getHistory } = require("../templates/soap_template");
const axios = require('axios');
const { parseString } = require('xml2js');

exports.getHistory = (req, res) => {
  if (!req.isTokenValid) {
    return res.json({ isLoggedIn: false, username: null });
  }
  let username = req.username;
  let Historyresponse;
  let history = [];

  const query = 'SELECT * FROM users WHERE username = ?';
  con.query(query, [username], function (err, results){
    if (err) {
      throw err;

    } else {
      if (results.length > 0) {
        const userId = results[0].id;
        const xml = util.format(getHistory.template, userId);
        axios.post(getHistory.url, xml, {
          headers: getHistory.headers
        })
        .then(response => {
          const { data } = response;
    
          parseString(data, (err, result) => {
            if (err) {
              console.error('Error parsing SOAP response:', err);
              throw err;
             
            }
            const data = result['S:Envelope']['S:Body'][0]['ns2:getHistoryResponse'][0]['return'][0];
            try{
              Historyresponse = JSON.parse(data).data;
            } catch {
              Historyresponse = [];
            }
            for (let i = 0; i < history.length; i++) {
              history.push({
                HistoryID: Historyresponse[i].HistoryID,
              });
            }
            
            // const querys = `
            // SELECT h.history_id as HistoryID, h.quantity as HistoryQuantity,
            //       p.productname as HistoryProductName, h.timestamp as HistoryDate,
            //       p.imagepath as HistoryImagePath
            // FROM users u
            // JOIN history h ON u.id = h.user_id
            // JOIN products p ON p.productid = h.product_id
            // WHERE username = ? AND h.history_id IN (${historyIds.map(id => '?').join(',')})`;

            const querys = `
            SELECT h.history_id as HistoryID, h.quantity as HistoryQuantity,
                   p.productname as HistoryProductName, h.timestamp as HistoryDate,
                   p.imagepath as HistoryImagePath
            FROM users u
            JOIN history h ON u.id = h.user_id
            JOIN products p ON p.productid = h.product_id
            WHERE username = ?`;
            
          con.query(querys, [req.username], function (err, result, fields) {
            if (err) throw err;
            res.json(result);
          });


          })
        });
        

      } 
      else {
        res.json({ success: false, message: "No user found" });
      }
    }
  })






 
};
