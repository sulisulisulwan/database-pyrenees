const fs = require('fs');
const path = require('path');
const etl = require('./etl.js');
const rl = require('readline')
const db = require('../db.js')
// const SKUS_ETL = () => {
  return new Promise ((resolve, reject) => {
    let product = {};
    let keys = [];
    let field;
    let isFirstLine = true;
    let buffer = 0
    let errors = [];
    let rowsInserted;
    let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + 'raw_data/product.csv', 'utf8')
    let readLine = rl.createInterface({
        input: readStream
    });

    readLine.on('line', (line) => {
      errors.push(line)
      readLine.pause();
        if (isFirstLine) {
          let keyCollection = etl.formatForDatabase(line, undefined, isFirstLine)
          keyCollection.forEach(key => keys.push(key));
          isFirstLine = false;
          readLine.resume()
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
                if (error) {
                  reject(new Error(error))
                } else {
                  console.log(result)
                  rowsInserted = result.insertId
                  resolve(result);
                }
              })
            })
          }
          insertField()
          .then((result) => {
            console.log(result);
            if (buffer > 200) {
              buffer = 0;
              readLine.resume();
            } else {
              console.log(buffer)
              buffer++;
            }
          })
          .catch((error) => {
            errors.push(JSON.stringify(error))
          })
        }
    })

    readLine.on('close', () => {
      if (rowsInserted === 1000011) {
        resolve('product.csv uploaded to SQL database')
      } else {
        reject('product.csv failed to properly load to SQL database')
      }
    });

  }
}




module.exports = PRODUCT_ETL;