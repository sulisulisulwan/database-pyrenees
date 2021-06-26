const mysql = require ('mysql');
const db = require('../db');

let productOptions = {
  tableName: 'Products',
  csvPath: 'raw_data/product.csv',
  query: `INSERT INTO Products (ID, Name, Slogan, Prod_Description, Category, Default_Price) VALUES (?, ?, ?, ?, ?, ?)`,
  targetRowCount:1000011,
  fillQueryFunc: formatProductQueryValues
}
let stylesOptions = {
  tableName: 'Product_Styles',
  csvPath: 'raw_data/styles.csv',
  query:  `INSERT INTO Product_Styles (ID, Name, Original_Price, Sale_Price, Default_Style, Product_ID) VALUES (?, ?, ?, ?, ?, ?)`;,
  targetRowCount:1958102,
  fillQueryFunc: formatStylesQueryValues
}
let featuresOptions = {
  tableName: 'Features',
  csvPath: 'raw_data/features.csv',
  query: `INSERT INTO Features (ID, Feature, Value, Product_ID) VALUES (?, ?, ?, ?)`,
  targetRowCount:2219279,
  fillQueryFunc: formatFeaturesQueryValues
}
let photosOptions = {
  tableName: 'Photos',
  csvPath: 'raw_data/photos.csv',
  query: `INSERT INTO Photos (ID, Thumbnail_URL, URL, Style_ID) VALUES (?, ?, ?, ?)`,
  targetRowCount:5655656,
  fillQueryFunc: formatPhotosQuery
}
let skusOptions = {
  tableName: 'SKUs',
  csvPath: 'raw_data/skus.csv',
  query: `INSERT INTO SKUS (ID, Quantity, Size, Style_ID) VALUES (?, ?, ?, ?)`,
  targetRowCount:11323917,
  fillQueryFunc: formatSKUsQuery
}
let relatedProductsOptions = {
  tableName: 'Related_Products',
  csvPath: 'raw_data/related.csv',
  query: `INSERT INTO Related_Products (ID, Product_IDs) VALUES (?, ?)`,
  targetRowCount: 1958102
  fillQueryFunc: formatRelatedQuery
}


const formatPhotosQueryValues = (formattedLine) => {
  let tableValues = {
    id: Object.keys(field)[0],
     thumbnail_url: field[id].thumbnail_url,
     url: field[id].url,
     styleId: field[id].styleId
  }
  return fillQueryValuesArray(tableValues)
}
const formatFeaturesQueryValues = (formattedLine) => {
  let tableValues = {
    id: Object.keys(formattedLine)[0],
    feature: formattedLine[id].feature,
    value: formattedLine[id].value,
    product_id: formattedLine[id].product_id;
  }
  return fillQueryValuesArray(tableValues)
}
const formatProductQueryValues = (formattedLine) => {
  let tableValues = {
    id: Number(Object.keys(field)[0]),
    name: formattedLine[id].name,
    slogan: formattedLine[id].slogan,
    description: formattedLine[id].description,
    category: formattedLine[id].category,
    default_price: formattedLine[id].default_price
  }
  return fillQueryValuesArray(tableValues)
}
const formatSKUsQueryValues = (formattedLine) => {
  let tableValues = {
    id: Number(Object.keys(formattedLine)[0]),
    quantity: formattedLine[id].quantity,
    size: formattedLine[id].size,
    styleId: formattedLine[id].styleId
  }
  return fillQueryValuesArray(tableValues)
}
const formatStylesQueryValues = (formattedLine) => {
  let tableValues = {
    id: Object.keys(formattedLine)[0],
    name: formattedLine[id].name,
    original_price: formattedLine[id].original_price,
    sale_price: formattedLine[id].sale_price,
    default_style: formattedLine[id].default_style,
    product_id: formattedLine[id].productId
  }
  return fillQueryValuesArray(tableValues)
}
const formatRelatedQueryValues = (formattedData) => {
  let tableValues = {
    id: formattedData.id
    relatedProducts: formattedData.relatedProducts
  }
  return fillQueryValuesArray(tableValues)
}
const fillQueryValuesArray = (tableValues) => {
  let queryValues = []
  for (let column in tableValues) {
    queryValues.push(tableValues[column])
  }
  return queryValues;
}
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
const ETL_TEMPLATE = (etlOptions) => {
  return new Promise((resolve, reject) => {
    let field;
    let isFirstLine = true;
    let keys = [];
    let buffer = 0;
    let rowCount = 0;
    let currentProductID = null;
    let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + etlOptions.csvPath, 'utf8')
    let readLine = rl.createInterface({
      input: readStream
    });
    readLine.on('line', (line) => {
      readLine.pause();
      if (isFirstLine) {
        isFirstLine = false;
        if (etlOptions.tableName === 'Related_Products') {
          return;
        } else {
          let keyCollection = formatForDatabase(line, undefined, isFirstLine)
          keyCollection.forEach(key => keys.push(key));
          isFirstLine = false;
        }
      } else {
        if (etlOptions.tableName === 'Related_Products') {
          let splitLine = line.split(',')
          if (splitLine[1] === currentProductID) {
            relatedProducts.push(Number(splitLine[2]))
            if (buffer === 0) {
              readLine.resume();
            }
            return;
          } else if (currentProductID === null) {
            currentProductID = splitLine[1];
            if (buffer === 0) {
              readLine.resume();
            }
            return;
          } else {
            let id = currentProductID;
            let loadRelatedProducts = JSON.stringify(relatedProducts)
            relatedProducts = [];
            field = {
              id: id
              relatedProducts: loadRelatedProducts
            }
          }
        } else {
          field = formatForDatabase(line, keys, isFirstLine)
        }
        let q = etlOptions.query
        let v = etlOptions.fillQueryFunc(field);
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
          if (rowCount === etlOptions.targetRowCount) {
            resolve(`${etlOptions.csvPath} uploaded to SQL database`)
          }
          if (rowCount % 5000 === 0) {
            console.log(rowCount);
          }
          if (buffer === 0) {
            readLine.resume();
          }
        })
        .catch((error) => {
          console.log(error)
        })
      }
      //reject(`${etlOptions.csvPath} FAILED to upload to SQL database`)
    })
  })
}




ETL_TEMPLATE(productOptions)
  .then(_=> {
    return ETL_TEMPLATE(stylesOptions)
  })
  .then(_=>{
    return ETL_TEMPLATE(featuresOptions)
  })
  .then(_=>{
    return ETL_TEMPLATE(photosOptions)
  })
  .then(_=>{
    return ETL_TEMPLATE(skusOptions)
  })
  .then(_=>{
    return ETL_TEMPLATE(relatedProductsOptions)
  })
  .then(_=>{
    console.log('DATABASE LOAD COMPLETE')
  })
  .catch(_=> {
    console.log('Database load FAILED')
  })



module.exports = {
  formatForDatabase: formatForDatabase
}