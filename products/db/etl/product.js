const fsPromise = require('fs/promises');
const path = require('path');
const formatForDatabase = require('./etl.js');


const PRODUCT_ETL = new Promise ((resolve, reject) => {
  let products = {};
  return fsPromise.readFile(__dirname.substring(0, __dirname.length - 3) + 'raw_data/product.csv', 'utf8')
  .then(result => {
    let formatted = formatForDatabase(result);
    })
  .catch(error => {
    reject(error);
  })
});

module.exports = PRODUCT_ETL;