const fsPromise = require('fs/promises');
const path = require('path');
const formatForDatabase = require('./etl.js');

const FEATURES_ETL = new Promise ((resolve, reject) => {
  let products = {};
  return fsPromise.readFile(__dirname.substring(0, __dirname.length - 3) + 'raw_data/features.csv', 'utf8')
  .then(result => {
    let formatted = formatForDatabase(result);
    })
  .catch(error => {
    reject(error);
  })
}


module.exports = FEATURES_ETL;

