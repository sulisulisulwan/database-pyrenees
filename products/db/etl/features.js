const fs = require('fs');
const path = require('path');
const etl = require('./etl.js');
const rl = require('readline')
const db = require('../db.js')
// const FEATURES_ETL = () => {
  // return new Promise ((resolve, reject) => {
    let rowCount = 0;
    let keys = [];
    let field;
    let isFirstLine = true;
    let rebootStream = {};
    let buffer = 0
    let rowsInserted;
    let lineCount = 0
    let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + 'raw_data/features.csv', 'utf8')
    let readLine = rl.createInterface({
        input: readStream
    });
    let currentProductID = null;

    readLine.on('line', (line) => {
      readLine.pause();
      lineCount++
      if (lineCount > ?) {
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
          let id = Object.keys(field)[0];
          let feature = field[id].feature
          let product_id = field[id].product_id
          let q = `INSERT INTO Photos (ID, Feature, Product_ID) VALUES (?, ?, ?)`;
          let v = [id, feature, product_id]
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
          resolve('photos.csv uploaded to SQL database')
        } else {
          reject('photos.csv failed to properly load to SQL database')
        }
      });
    // }
  //   }
  // }
// }

module.exports = FEATURES_ETL;

