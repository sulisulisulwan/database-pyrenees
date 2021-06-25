const fs = require('fs');
const path = require('path');
const etl = require('./etl.js');
const rl = require('readline')
const db = require('../db.js')


// const STYLES_ETL = () => {
//   return new Promise ((resolve, reject) => {
    let keys = [];
    let field;
    let isFirstLine = true;
    let buffer = 0
    let rowCount = 0;
    let rowsInserted;
    let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + 'raw_data/styles.csv', 'utf8')
    let readLine = rl.createInterface({
        input: readStream
    });

    readLine.on('line', (line) => {
      readLine.pause();
      if (isFirstLine) {
        let keyCollection = etl.formatForDatabase(line, undefined, isFirstLine)
        keyCollection.forEach(key => keys.push(key));
        isFirstLine = false;
        return;
      } else {
        buffer++;
        field = etl.formatForDatabase(line, keys, isFirstLine)
        let id = Object.keys(field)[0];
        let name = field[id].name
        let original_price = field[id].original_price
        let sale_price = field[id].sale_price
        let default_style = field[id].default_style
        let product_id = field[id].productId
        let q = `INSERT INTO Product_Styles (ID, Name, Original_Price, Sale_Price, Default_Style, Product_ID) VALUES (?, ?, ?, ?, ?, ?)`;
        let v = [id, name, original_price, sale_price, default_style, product_id]
        let insertField = () => {
          return new Promise((resolve, reject) => {
            db.query(q, v, (error, result) => {
              if (error) {
                console.log(error)
                reject(new Error(error))
              } else {
                rowsInserted = result.insertId
                resolve(result);
              }
            })
          })
        }
        insertField()
        .then((result) => {
          rowCount++;
          buffer--;
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

    // readLine.on('close', () => {
    //   if (rowsInserted === 1958102) {
    //     resolve('styles.csv uploaded to SQL database')
    //   } else {
    //     reject('styles.csv failed to properly load to SQL database')
    //   }
    // });
//   }
// }

// module.exports = STYLES_ETL;