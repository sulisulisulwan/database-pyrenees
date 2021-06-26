const fs = require('fs');
const path = require('path');
const etl = require('./etl.js');
const rl = require('readline')
const db = require('../db.js')



const FEATURES_ETL = () => {
  return new Promise ((resolve, reject) => {
    let keys = [];
    let field;
    let isFirstLine = true;
    let buffer = 0
    let rowCount = 0;
    let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + 'raw_data/features.csv', 'utf8')
    let readLine = rl.createInterface({
        input: readStream
    });

    readLine.on('line', (line) => {
      readLine.pause();
      if (isFirstLine) {
        let keyCollection = etl.formatForDatabase(line, undefined, isFirstLine)
        keyCollection.forEach(key => keys.push(key));
        isFirstLine = false;
      } else {
        field = etl.formatForDatabase(line, keys, isFirstLine)
        let id = Object.keys(field)[0];
        let feature = field[id].feature;
        let value = field[id].value;
        let product_id = field[id].product_id;
        let q = `INSERT INTO Features (ID, Feature, Value, Product_ID) VALUES (?, ?, ?, ?)`;
        let v = [id, feature, value, product_id]
        let insertField = () => {
          return new Promise((resolve, reject) => {
            db.query(q, v, (error, result) => {
              error ? reject(new Error(error)) : resolve(result);
            })
          })
        }
        buffer++;
        insertField()
        .then((result) => {
          buffer--
          rowCount++;
          if (rowCount === 2219279) {
            resolve('features.csv uploaded to SQL database')
          }
          if (rowCount % 5000 === 0) {
            console.log(rowCount);
          }
          if (buffer === 0) {
            readLine.resume();
          }
        })
        .catch((error) => {
          console.log(error)
        })
      }
    })
    // reject('features.csv failed to properly load to SQL database')
  })
}




module.exports = FEATURES_ETL;

