const FEATURES_ETL = require('./features.js');
const PHOTOS_ETL = require('./photos.js');
const PRODUCT_ETL = require('./product.js');
const RELATED_ETL = require('./related.js');
const SKUS_ETL = require('./skus.js');
const STYLES_ETL = require('./styles.js');








const formatForDatabase = (csvFile) => {
  let splitCSVFile = csvFile.split('\n')
  let keys = []
  let table = {}
  splitCSVFile.forEach((entry, i )=> {
  let field = entry.split(',')
    if (i === 0) {
      field.forEach(key => keys.push(key))
    } else {
      let id = field[0]
      table[id] = {};
      keys.forEach((key, i) => {
        let value = (key === 'id' || key === 'style_id' || key === 'quantity') ? Number(field[i])
          : key === 'default?' ? ((field[i] === 'true') ? true : false)
          : field[i].replace('"', '').replace('"', '');
          table[id][key] = value;
      });
      ;
    }
  })
  return table;
}

module.exports = formatForDatabase;