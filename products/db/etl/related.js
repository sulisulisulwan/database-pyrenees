const fs = require('fs')
const path = require('path');
const etl = require('./etl.js');
const rl = require('readline')
const db = require('../db.js')

console.log('updated2')
// const SKUS_ETL = () => {
//   return new Promise ((resolve, reject) => {
  let relatedProducts = [];
  let rowCount = 0;
  let keys = [];
  let field;
  let isFirstLine = true;
  let buffer = 0
  let rowsInserted;
  let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + 'raw_data/related.csv', 'utf8')
  let readLine = rl.createInterface({
      input: readStream
  });
  let currentProductID = null;
  let itWentThrough = false;
  readLine.on('line', (line) => {
    readLine.pause();
    if (isFirstLine) {
      isFirstLine = false;
      buffer--
      return
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
        if (
          line === '4508258,1000011,275004' || line === '4508259,1000011,93556'
        || line === '4508260,1000011,125885' || line === '4508261,1000011,166656'
        || line === '4508262,1000011,875619' || line === '4508263,1000011,592637') {
          itWentThrough = true;
          console.log(line, 'values is ', v)
        }
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
        buffer++
        insertField()
        .then((result) => {
          if(itWentThrough) {
            // console.log(result);
          }
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

    }
  })

    // readLine.on('close', () => {
    //   if (rowsInserted === 1958102) {
    //     resolve('related.csv uploaded to SQL database')
    //   } else {
    //     reject('related.csv failed to properly load to SQL database')
    //   }
    // });
//   }
// }

// module.exports = RELATED_PRODUCTS_ETL;