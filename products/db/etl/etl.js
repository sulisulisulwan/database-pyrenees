const mysql = require ('mysql');
const db = require('../db');
const options = require('./etlTemplateOptions');
const etl = require('./etlTemplate.js');


// etl.ETL_TEMPLATE(options.productOptions)
//   .then(result=> {
  // console.log(result)
    return etl.ETL_TEMPLATE(options.stylesOptions)
//   })
//   .then(result=>{
  // console.log(result)
//     return etl.ETL_TEMPLATE(options.featuresOptions)
//   })
  .then(result=>{
    console.log(result)
    return etl.ETL_TEMPLATE(options.photosOptions)
  })
  .then(result =>{
    console.log(result)
    return etl.ETL_TEMPLATE(options.skusOptions)
  })
  // .then(result=>{
    // console.log(result)
  //   return etl.ETL_TEMPLATE(options.relatedProductsOptions)
  // })
  .then(result=>{
    console.log(result)
    console.log('DATABASE LOAD COMPLETE')
  })
  .catch(_=> {
    console.log('Database load FAILED')
    db.end();
  });