const fs = require('fs');
const path = require('path');
const etl = require('./etl.js');
const rl = require('readline')
const db = require('../db.js')

const PRODUCT_ETL = () => {
  return new Promise ((resolve, reject) => {
    let keys = [];
    let field;
    let isFirstLine = true;
    let buffer = 0;
    let rowCount = 0;
    let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + 'raw_data/product.csv', 'utf8')
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
        let id = Number(Object.keys(field)[0]);
        let name = field[id].name
        let slogan = field[id].slogan
        let description = field[id].description
        let category = field[id].category
        let default_price = field[id].default_price
        let q = `INSERT INTO Products (ID, Name, Slogan, Prod_Description, Category, Default_Price) VALUES (?, ?, ?, ?, ?, ?)`;
        let v = [id, name, slogan, description, category, default_price]
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
          buffer--;
          rowCount++
          if (rowCount === 1000011) {
            resolve('product.csv uploaded to SQL database')
          }
          if (rowCount % 5000 === 0) {
            console.log(rowCount)
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
// reject('skus.csv failed to properly load to SQL database')
  })
}





module.exports = PRODUCT_ETL;