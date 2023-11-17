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

            Historyresponse.forEach(historyItem => {
              const queryProduct = `SELECT p.productname as HistoryProductName, p.imagepath as HistoryImagePath FROM products p WHERE p.productid = ?`;
              con.query(queryProduct, [historyItem.product_id], function (err, result, fields) {
                if (err) throw err;
            
                if (result && result.length > 0) {
                  history.push({
                    HistoryID: historyItem.HistoryID,
                    HistoryQuantity: historyItem.HistoryQuantity,
                    HistoryDate: historyItem.HistoryDate,
                    HistoryProductName: result[0].HistoryProductName,
                    HistoryImagePath: result[0].HistoryImagePath
                  });
                } else {
                  history.push({
                    HistoryID: historyItem.HistoryID,
                    HistoryQuantity: historyItem.HistoryQuantity,
                    HistoryDate: historyItem.HistoryDate,
                    HistoryProductName: "Product Not Found",
                    HistoryImagePath: "DefaultImagePath"
                  });
                }
            
                if (history.length === Historyresponse.length) {
                  res.json(history);
                }
              });
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
