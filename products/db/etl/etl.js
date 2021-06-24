const mysql = require ('mysql');
const db = require('../db');
// const FEATURES_ETL = require('./features.js');
// const PHOTOS_ETL = require('./photos.js');
// const PRODUCT_ETL = require('./product.js');
const RELATED_ETL = require('./related.js');
// const SKUS_ETL = require('./skus.js');
// const STYLES_ETL = require('./styles.js');


let formatForDatabase = (line, preexistingKeys, isFirstLine) => {
  //column1,column2,column3
  // console.log('the line is ', line)
  // console.log('the preexisting keys are  ', preexistingKeys)
  // console.log('is it the first line? ', isFirstLine)
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

// RELATED_ETL()
//   .then(relatedProducts => {
//     //ID will be id
//     //relatedProducts[id] will be Product_IDs
//     //table will be Related_Products
//     for (let id in relatedProducts) {
//       let insertQuery = async function (values) {
//           let q = `INSERT INTO Related_Products (Product_IDs) VALUES ? ;`;
//           db.connection.query(q, values, (error, results) => {
//             if (error) {
//               throw new Error(error)
//             } else {
//               console.log('successfully added entry')
//             }
//           })
//       }
//       await insertQuery(relatedProducts[id]);
//     }
//   })

module.exports = {
  formatForDatabase: formatForDatabase
}