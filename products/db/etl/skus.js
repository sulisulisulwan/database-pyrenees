const fs = require('fs');
const path = require('path');
const etl = require('./etl.js');
const rl = require('readline')
const db = require('../db.js')

// const PRODUCT_ETL = () => {
//   return new Promise ((resolve, reject) => {
    let skus = [];
    let rowCount = 0;
    let keys = [];
    let field;
    let isFirstLine = true;
    let rebootStream = {};
    let buffer = 0
    let rowsInserted;
    let lineCount = 0
    let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + 'raw_data/skus.csv', 'utf8')
    let readLine = rl.createInterface({
        input: readStream
    });
    let currentProductID = null;

    readLine.on('line', (line) => {
      readLine.pause();
      lineCount++
      if (lineCount > 4508252) {
        console.log(lineCount)
        console.log(line)
      }
        if (isFirstLine) {
          let keyCollection = etl.formatForDatabase(line, undefined, isFirstLine)
          keyCollection.forEach(key => keys.push(key));
          isFirstLine = false;
          readLine.resume()
        } else {
          field = etl.formatForDatabase(line, keys, isFirstLine)
          let id = Number(Object.keys(field)[0]);
          let quantity = field[id].quantity
          let size = field[id].size
          let style_id = field[id].style_id
          let q = `INSERT INTO Products (ID, Quantity, SloganSize, Style_ID) VALUES (?, ?, ?, ?)`;
          let v = [id, quantity, size, style_id]
          let insertField = () => {
            return new Promise((resolve, reject) => {
              db.query(q, v, (error, result) => {
                if (error) {
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

    readLine.on('pause', ()=> {
      rebootStream = setInterval(()=>{
        readLine.resume()
      }, 5000)
    })

      readLine.on('close', () => {
        clearInterval(rebootStream);
        if (rowsInserted === ?) {
          resolve('skus.csv uploaded to SQL database')
        } else {
          reject('skus.csv failed to properly load to SQL database')
        }
      });
    // }
//   }
// }

// module.exports = SKUS_ETL;