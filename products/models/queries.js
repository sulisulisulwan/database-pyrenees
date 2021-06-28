const db = require('../db/db.js')

 let queryProducts = (params) => {
  return new Promise((resolve, reject) => {
    let page = params.page;
    let count = params.count;
    let idMaxRange = page * 10;
    let idMinRange = idMaxRange - 9;
    let chosenMaxRange = count - 1 + idMinRange
    let q = `SELECT * FROM Products WHERE ID >= ${idMinRange} AND ID <= ${chosenMaxRange};`
    db.query(q, (err, result)=> {
      err ? reject(new Error(err)) : resolve(result);
    })
  })
}

let queryProductById = (productID) => {
  return new Promise((resolve, reject) => {
    let q = `SELECT * FROM Products WHERE ID = ${productID};`
    db.query(q, (err, result)=> {
      err ? reject(new Error(err)) : resolve(result);
    })
  })
}

let queryProductStyles = (productID) => {
  return new Promise((resolve, reject) => {
    let q = `SELECT * FROM Product_Styles WHERE Product_ID = ${productID};`
    db.query(q, (err, result)=> {
      err ? reject(new Error(err)) : resolve(result);
    })
  })
}

let queryFeatures = (productID) => {
  return new Promise((resolve, reject) => {
    let q = `SELECT * FROM Features WHERE Product_ID = ${productID};`
    db.query(q, (err, result)=> {
      err ? reject(new Error(err)) : resolve(result);
    })
  })
}

let querySKUs = (productID) => {
  return new Promise((resolve, reject) => {
    let q = `SELECT * FROM SKUs WHERE Product_ID = ${productID};`
    db.query(q, (err, result)=> {
      err ? reject(new Error(err)) : resolve(result);
    })
  })
}

let queryPhotos = (productID) => {
  return new Promise((resolve, reject) => {
    let q = `SELECT * FROM Photos WHERE Product_ID = ${productID};`
    db.query(q, (err, result)=> {
      err ? reject(new Error(err)) : resolve(result);
    })
  })
}

let queryRelatedProducts = (productID) => {
  return new Promise((resolve, reject) => {
    let q = `SELECT * FROM Related_Products WHERE ID = ${productID};`
    db.query(q, (err, result)=> {
      err ? reject(new Error(err)) : resolve(result);
    })
  })
}

let queryStylesSKUsPhotos = (productID) => {
  return new Promise ((resolve, reject) => {
    return Promise.all([queryProductStyles(productID), queryPhotos(productID), querySKUs(productID)])
      .then(results => {
        resolve(results);
      })
      .catch(error=> {
        reject(new Error(error))
      })
  })

}

module.exports = {
  queryProducts: queryProducts,
  queryProductById: queryProductById,
  queryProductStyles: queryProductStyles,
  queryFeatures: queryFeatures,
  querySKUs: querySKUs,
  queryPhotos: queryPhotos,
  queryRelatedProducts: queryRelatedProducts,
  queryStylesSKUsPhotos: queryStylesSKUsPhotos
}