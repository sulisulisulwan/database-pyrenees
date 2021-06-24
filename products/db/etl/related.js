const fs = require('fs')
const path = require('path');
const etl = require('./etl.js');
const rl = require('readline')
const db = require('../db.js')

// const SKUS_ETL = () => {
//   return new Promise ((resolve, reject) => {
  let relatedProducts = [];
  let rowCount = 0;
  let keys = [];
  let field;
  let isFirstLine = true;
  let rebootStream= {};
  let buffer = 0
  let errors = [];
  let rowsInserted;
  let lineCount = 0
  let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + 'raw_data/related.csv', 'utf8')
  let readLine = rl.createInterface({
      input: readStream
  });
  let currentProductID = null;

  readLine.on('line', (line) => {
    lineCount++
    readLine.pause();
    if (isFirstLine) {
      isFirstLine = false;
      clearInterval(rebootStream)
      readLine.resume()
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
        //QUERY
        let q = `INSERT INTO Related_Products (ID, Product_IDs) VALUES (?, ?)`;
        let v = [Number(id), loadRelatedProducts]
        if (id > 1000000) {
          console.log(v);
        }
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
          rowCount++;
          if (rowCount > 1000000) {
            console.log('rowCount', rowCount)
            console.log(result)
          } else if (rowCount % 10000 === 0) {
            console.log(rowCount);
          }
          if (buffer > 600) {
            buffer = 0;
              if (rebootStream['_repeat'] !== undefined) {
                clearInterval(rebootStream)
              }
            clearInterval(rebootStream)
            readLine.resume();
          } else {
            buffer++;
          }
        })
        .catch((error) => {
          errors.push(JSON.stringify(error))
        })
    }
  }
})

readLine.on('pause', ()=> {
  rebootStream = setInterval(()=>{
    readLine.resume()
  }, 5000)
})

readLine.on('close', () => {
  clearInterval(rebootStream);
})

// module.exports = RELATED_PRODUCTS_ETL;