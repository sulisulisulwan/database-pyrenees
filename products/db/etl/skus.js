const fs = require('fs');
const path = require('path');
const etl = require('./etl.js');
const rl = require('readline')
const db = require('../db.js')
// const SKUS_ETL = new Promise ((resolve, reject) => {

  let skus = {};
  let keys = [];
  let field;
  let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + 'raw_data/skus.csv', 'utf8')
  let readLine = rl.createInterface({
      input: readStream
  });

  let isFirstLine = true;

  readLine.on('line', (line) => {
    readLine.pause()
    if (isFirstLine) {
      let keyCollection = etl.formatForDatabase(line, undefined, isFirstLine)
      keyCollection.forEach(key => keys.push(key));
      isFirstLine = false;
      readLine.resume()
    } else {
      field = etl.formatForDatabase(line, keys, isFirstLine)
      let q = `INSERT INTO SKUs (ID, Quantity, Size, Style_ID) VALUES (?, ?, ?, ?)`;
      let id = Object.keys(field)[0]
      let v = [id, field[id].quantity, field[id].size, field[id].styleId]

      let insertField = () => {
        return new Promise((resolve, reject) => {
          db.query(q, v, (error, result) => {
            if (error) {
              reject(new Error(error))
            } else {
              console.log(results)
              resolve(results);
            }
          })
        })
      }
      insertField()
        .then((result) => {
          console.log(result);
          readLine.resume();
        })
        .catch((error) => {
          console.log(error);
        })
    }
  })



  // readStream.on('data', (chunk) => {


  //     // readStream.pause()

  //     let readThis = chunk.split('\n')
  //     let result;
  //     if (chunkCount === 0) {
  //       result = etl.formatForDatabase(chunk)
  //       keys = Object.keys(result['1'])
  //     } else {
  //       result = etl.formatForDatabase(chunk, keys)
  //     }
  //     console.log(result)
  //     for (let id in result) {
  //       keys.forEach(key => {
  //         if (photos[id] === undefined) {
  //           photos[id] = {}
  //         }
  //         photos[id][key] = result[id][key]});
  //     }
  //     chunkCount++

  //     //POSSIBLY PUT THESE INTO DATABASE


  //     // readStream.resume();

  // })

  // readStream.on('end', () => {
  //   // console.log(photos)
  //   // console.log('STREAM COMPLETED')
  //   // let photos = formatForDatabase(data);
  //   // console.log('FORMATTED')
  //   // console.log(Object.keys(photos).length)
  // })

// }

// module.exports = SKUS_ETL;