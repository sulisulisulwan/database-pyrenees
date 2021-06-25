const db = require('./db/db.js')


/***************************************
 *
 *                  QUERIES
 *
 ***************************************/


let queryProducts = () => {
  return new Promise((resolve, reject) => {
    // let q = `SELECT * FROM Products`
    // db.query(q, (err, result)=> {
      let err = undefined //DELETE THIS
      if (err) {
        reject(new Error(err))
      } else {
        resolve('it works at the moment')
        // resolve(result)
      }
      // })
    })
  }

let queryProductById = (productID) => {
  return new Promise((resolve, reject) => {
    // let q = `SELECT * FROM Products WHERE ID = ${productID};`
    // db.query(q, (err, result)=> {
      let err = undefined //DELETE THIS
      if (err) {
        reject(new Error(err))
      } else {
      resolve('it works at the moment')
      // resolve(result)
    }
    // })
  })
}

let queryProductStyles = (productID) => {
  return new Promise((resolve, reject) => {
    // let q = `SELECT * FROM Product_Styles WHERE Product_ID = ${productID};`
    // db.query(q, (err, result)=> {
      let err = undefined //DELETE THIS
      if (err) {
        reject(new Error(err))
      } else {
        resolve('it works at the moment')
        // resolve(result)
      }
      // })
    })
  }


let queryFeatures = (productID) => {
  return new Promise((resolve, reject) => {
    // let q = `SELECT * FROM Features WHERE Product_ID = ${productID};`
    // db.query(q, (err, result)=> {
      let err = undefined //DELETE THIS
      if (err) {
        reject(new Error(err))
      } else {
        resolve('it works at the moment')
        // resolve(result)
      }
      // })
    })
  }

let querySKUs = (styleID) => {
  return new Promise((resolve, reject) => {
    //THIS MAY HAVE TO BE A JOINED TABLE
    // let q = `SELECT * FROM SKUs WHERE Style_ID = ${styleID};`
    // db.query(q, (err, result)=> {
      let err = undefined //DELETE THIS
      if (err) {
        reject(new Error(err))
      } else {
        resolve('it works at the moment')
        // resolve(result)
      }
      // })
    })
}

let queryPhotos = (styleID) => {
  return new Promise((resolve, reject) => {
    // let q = `SELECT * FROM Photos WHERE Style_ID = ${styleID}`
    // db.query(q, (err, result)=> {
      let err = undefined //DELETE THIS
      if (err) {
        reject(new Error(err))
      } else {
        resolve('it works at the moment')
        // resolve(result)
      }
    })
    // })
}

let queryRelatedProducts = (productID) => {
  return new Promise((resolve, reject) => {
  // let q = `SELECT * FROM Related_Products WHERE ID = ${productID}`
  // db.query(q, (err, result)=> {
    let err = undefined //DELETE THIS
    if (err) {
      reject(new Error(err))
    } else {
      resolve('it works at the moment')
      // resolve(result)
    }
  })
  // })
}

/************************************
 *
 *            ENDPOINT ROUTINGS
 *
 ************************************/



const getAllProducts = () => {
  //query products table
  return new Promise ((resolve, reject) => {
    queryProducts()
    .then(allProducts => {
      let formattedData = 'TODO:';
      console.log('format this', allProducts);
      resolve(formattedData);
    })
    .catch(error => {
      error = new Error(error)
      console.log(error)
      reject(error)
    })
  })
}

const getProductById = (productID) => {
  return new Promise ((resolve, reject) => {
    let productPromise = queryProductById(productID)
    let featuresPromise = queryFeatures(productID);
    return Promise.all([productPromise, featuresPromise])
      .then(allData => {
        let product = allData[0]
        let features = allData[1]

        console.log('format product: ', product);
        console.log('format features: ', features);

        let formattedData = 'TODO:';
        //combine  and format returned data
        // formattedData = {
        //   id: TODO:,
        //   name: TODO:,
        //   slogan: TODO:,
        //   description: TODO:,
        //   category: TODO:,
        //   default_price: TODO:,
        //   features: []
        // }
        // //iterate through features
        // //for each feature
        // let feature = {
        //   feature: TODO:,
        //   value: TODO:
        // }
        // done with iteration
        resolve(formattedData);
     })
     .catch(error=> {
      error = new Error(error)
      console.log(error)
      reject(error)
     })
  })
}

const getProductStyles = (productID) => {
  return new Promise((resolve, reject) => {
    queryProductStyles(productID)
    .then(results => {
      //after query this query is done RESULT SHOULD BE MULTIPLE ROWS
      let styleID;
      let styles; //this will be an array of all style row
      let skusPromises = [];
      let photosPromises = [];
      //iterate through all rows
      for (let i = 0; i < styles.length; i++) {
        styleID //will equal the current iterated rows id
        skusPromises.push(querySKUs(styleID));
        photosPromises.push(queryPhotos(styleID));
      }
      let allDataPromises = [skusPromises, photosPromises]
      return Promise.all(allDataPromises)
    })
    .then(allData => {
      let skusData = allData[0]
      let photosData = allData[1]

      //STYLES TEMPLATE
      let formattedData = {
        product_id: `${productID}`,
        results: [] //this will be filled with objects of nested data
      }

      let styleResult = {
        style_id: null,
        name: null,
        original_price: null,
        sale_price: null,
        'default?': null,
        photos: null, //this needs to be an array
        skus: null//this will be an object of objects
      }

      let photos = {
        thumbnail_url: null,
        url: null
      }

      let skus = {}
      for (let i = 0; i < styles.length; i++) {
        //FILL OUT TEMPLATE HERE;
      }
      resolve(formattedData);
    })
    .catch(error => {
      error = new Error(error)
      console.log(error)
      reject(error)
    })
  })
}

const getRelatedProducts = (productID) => {
  return new Promise ((resolve, reject) =>{
    queryRelatedProducts()
    .then(results => {
      //check format
      //probably JSON.parse(results?)
      let formattedData = ['TODO:'] //this could be directly assigned to the parsed results
      console.log(results)
      resolve(formattedData);
    })
    .catch(error => {
      error = new Error(error)
      console.log(error)
      reject(error)
    });
  })
}

module.exports = {
  getAllProducts: getAllProducts,
  getProductById: getProductById,
  getProductStyles: getProductStyles,
  getRelatedProducts: getRelatedProducts
}