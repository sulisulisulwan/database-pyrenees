const mysql = require ('mysql');
const db = require('../db');
const options = require('./etlTemplateOptions');
const etl = require('./etlTemplate.js');


etl.ETL_TEMPLATE(options.productOptions)
  .then(_=> {
    return etl.ETL_TEMPLATE(options.stylesOptions)
  })
  .then(_=>{
    return etl.ETL_TEMPLATE(options.featuresOptions)
  })
  .then(_=>{
    return etl.ETL_TEMPLATE(options.photosOptions)
  })
  .then(_=>{
    return etl.ETL_TEMPLATE(options.skusOptions)
  })
  .then(_=>{
    return etl.ETL_TEMPLATE(options.relatedProductsOptions)
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