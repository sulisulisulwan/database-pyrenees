const fsPromise = require('fs/promises')
const path = require('path');

const RELATED_PRODUCTS_ETL = new Promise ((resolve, reject) => {
  let relatedProducts = {};
  return fsPromise.readFile(__dirname.substring(0, __dirname.length - 3) + 'raw_data/related.csv', 'utf8')
  .then(result => {
    result.split('\n').forEach(item => {
      let splitItem = item.split(',')
      if (relatedProducts[splitItem[1]] === undefined) {
        relatedProducts[splitItem[1]] = []
      }
      relatedProducts[splitItem[1]].push(splitItem[2]);
    })
    //
    for (let key in relatedProducts) {
      relatedProducts[key] = relatedProducts[key].join('_')
    }
    resolve(relatedProducts)
  })
  .catch(error => {
    reject(error);
  })
})

module.exports = RELATED_PRODUCTS_ETL;