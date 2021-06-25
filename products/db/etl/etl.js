const mysql = require ('mysql');
const db = require('../db');
// const FEATURES_ETL = require('./features.js');
// const PHOTOS_ETL = require('./photos.js');
// const PRODUCT_ETL = require('./product.js');
// const RELATED_ETL = require('./related.js');
// const SKUS_ETL = require('./skus.js');
// const STYLES_ETL = require('./styles.js');


let formatForDatabase = (line, preexistingKeys, isFirstLine) => {
  let keys = []
  let tableEntry = {}
  let field = line.split(',')

  if (isFirstLine === true) {

    field.forEach(key => keys.push(key))
    return keys;
  }
  keys = preexistingKeys
  let id = field[0]
  tableEntry[id] = {};
  let value;
  keys.forEach((key, i) => {
    value = (
      key === 'url'
      || key === 'thumbnail_url'
      || key === 'name'
      || key === 'sale_price'
      || key === 'original_price'
      || key === 'default_price'
      || key === 'size'
      || key === 'slogan'
      || key === 'description'
      || key === 'category'
      || key === 'feature'
      || key === 'value'
      ) ? field[i].replace('"', '').replace('"', '')
      : (key === 'id' || key === 'style_id' || key === 'quantity' || 'productId') ? Number(field[i])
      : key === 'default?' ? ((field[i] === 'true') ? true : false)
      : field[i];
    tableEntry[id][key] = value;
  });
  return tableEntry;
}


// STYLES_ETL().then((result)=> {
//   console.log(result)
// })
// .catch(
//   console.log('error')
// )

module.exports = {
  formatForDatabase: formatForDatabase
}