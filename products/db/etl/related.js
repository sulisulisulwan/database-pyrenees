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
      if (lineCount > 4508251) {
        console.log('line is', line)
      }
      let splitLine = line.split(',')
      if (lineCount > 4508251) {
        console.log('splitline is', splitLine)
      }
      if (splitLine[1] === currentProductID) {
        relatedProducts.push(Number(splitLine[2]))
        if (lineCount > 4508251) {
          console.log('if splite line [1] is current product id, this is pushed', relatedProducts)
        }
      } else if (currentProductID === null) {
        currentProductID = splitLine[1];
        if (lineCount > 4508251) {
          console.log('if current product id is null, currentProductId is', currentProductID)
        }
      } else {
        let id = currentProductID;
        if (lineCount > 4508251) {
          console.log('id is ', id)
        }
        let loadRelatedProducts = JSON.stringify(relatedProducts)
        currentProductID = splitLine[1]
        relatedProducts = [];
        //QUERY
        let q = `INSERT INTO Related_Products (ID, Product_IDs) VALUES (?, ?)`;
        let v = [Number(id), loadRelatedProducts]
        let insertField = () => {
          return new Promise((resolve, reject) => {
            db.query(q, v, (error, result) => {
              if (error) {
                reject(new Error(error))
              } else {
                buffer--;
                rowsInserted = result.insertId
                resolve(result);
              }
            })
          })
        }
        insertField()
        .then((result) => {
          rowCount++;
          if (buffer === 1) {
            buffer = 0;
            readLine.resume();
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
  console.log('DATA STREAM CLOSED')
  clearInterval(rebootStream);
})

// module.exports = RELATED_PRODUCTS_ETL;