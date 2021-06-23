const fsPromise = require('fs/promises');
const path = require('path');
const formatForDatabase = require('./etl.js');

// const PHOTOS_ETL = new Promise ((resolve, reject) => {
  let products = {};
  return fsPromise.readFile(__dirname.substring(0, __dirname.length - 3) + 'raw_data/photos.csv', 'utf8')
  .then(result => {
    let formatted = formatForDatabase(result);
    console.log(formatted)
    })
  // .catch(error => {
  //   reject(error);
  // })
// }


module.exports = PHOTOS_ETL;