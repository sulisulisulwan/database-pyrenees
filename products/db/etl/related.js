const fs = require('fs')
const path = require('path');
const etl = require('./etl.js');
const rl = require('readline')
const db = require('../db.js')

const SKUS_ETL = () => {
  return new Promise ((resolve, reject) => {
    let keys = [];
    let field;
    let isFirstLine = true;
    let buffer = 0;
    let rowCount = 0;
    let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + 'raw_data/related.csv', 'utf8')
    let readLine = rl.createInterface({
      input: readStream
    });

    let relatedProducts = [];
    let currentProductID = null;

    readLine.on('line', (line) => {
      readLine.pause();
      if (isFirstLine) {
        isFirstLine = false;
        buffer--
      } else {
        let splitLine = line.split(',')
        if (splitLine[1] === currentProductID) {
          relatedProducts.push(Number(splitLine[2]))
        } else if (currentProductID === null) {
          currentProductID = splitLine[1];
        } else {
          let id = currentProductID;
          let loadRelatedProducts = JSON.stringify(relatedProducts)
          currentProductID = splitLine[1]
          relatedProducts = [];
          let q = `INSERT INTO Related_Products (ID, Product_IDs) VALUES (?, ?)`;
          let v = [Number(id), loadRelatedProducts]
          let insertField = () => {
            return new Promise((resolve, reject) => {
              db.query(q, v, (error, result) => {
                error ? reject(new Error(error)) : resolve(result);
              })
            })
          }
          buffer++
          insertField()
          .then((result) => {
            buffer--;
            rowCount++;
            if (rowCount === 1958102) {
              resolve('related.csv uploaded to SQL database')
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
      }
    });
    // reject('related.csv failed to properly load to SQL database')
  });
}

module.exports = RELATED_PRODUCTS_ETL;