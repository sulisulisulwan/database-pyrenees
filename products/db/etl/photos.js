const fs = require('fs')
const path = require('path');
const etl = require('./etl.js');
const rl = require('readline')
const db = require('../db.js')



const PHOTOS_ETL = () => {
  return new Promise ((resolve, reject) => {
    let keys = [];
    let field;
    let isFirstLine = true;
    let buffer = 0
    let rowCount = 0;
    let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + 'raw_data/photos.csv', 'utf8')
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
        let id = Object.keys(field)[0];
        let thumbnail_url = field[id].thumbnail_url
        let url = field[id].url
        let styleId = field[id].styleId
        let q = `INSERT INTO Photos (ID, Thumbnail_URL, URL, Style_ID) VALUES (?, ?, ?, ?)`;
        let v = [id, thumbnail_url, url, styleId]
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
          rowCount++;
          if (rowCount === 5655656) {
            resolve('photos.csv uploaded to SQL database')
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
    });
    // reject('photos.csv failed to properly load to SQL database')
  });
}



module.exports = PHOTOS_ETL;