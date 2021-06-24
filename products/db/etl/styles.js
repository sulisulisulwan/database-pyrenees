const fsPromise = require('fs/promises');
const path = require('path');
const etl = require('./etl.js');


const STYLES_ETL = () => {
  return new Promise ((resolve, reject) => {
    return fsPromise.readFile(__dirname.substring(0, __dirname.length - 3) + 'raw_data/styles.csv', 'utf8')
      .then(result => {
        let formatted = etl.formatForDatabase(result)
        resolve(formatted);
      })
      .catch(error => {
        reject(error);
      })
    });
}

STYLES_ETL()
  .then(results => {
    console.log(results)
  })




module.exports = STYLES_ETL;