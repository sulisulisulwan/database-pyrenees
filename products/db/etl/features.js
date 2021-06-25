const fs = require('fs');
const path = require('path');
const etl = require('./etl.js');
const rl = require('readline')
const db = require('../db.js')



const FEATURES_ETL = () => {
  return new Promise ((resolve, reject) => {
    let rowCount = 0;
    let keys = [];
    let field;
    let isFirstLine = true;
    let buffer = 0
    let rowsInserted;
    let lineCount = 0
    let currentProductID = null;
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
        buffer++
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
              if (error) {
                console.log(error);
                reject(new Error(error))
              } else {
                resolve(result);
              }
            })
          })
        }
        insertField()
        .then((result) => {
          rowCount++;
          buffer--
          if (rowCount % 5000 === 0) {
            console.log(rowCount);
          }
          if (buffer === 0) {
            buffer = 0;
            readLine.resume();
          }
        })
        .catch((error) => {
          console.log(error)
        })
      }
    })
    readLine.on('close', () => {
      clearInterval(rebootStream);
      if (rowsInserted === 2219279) {
        resolve('features.csv uploaded to SQL database')
      } else {
        reject('features.csv failed to properly load to SQL database')
      }
    });
  })
}



module.exports = FEATURES_ETL;

