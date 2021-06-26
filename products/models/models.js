const db = require('../db/db.js')
const q = require ('./queries.js')

const getAllProducts = (params) => {
  return new Promise ((resolve, reject) => {
    q.queryProducts(params)
    .then(allProducts => {
      let formattedData = []
      let dataPacketKeys = Object.keys(allProducts);
      dataPacketKeys.forEach(key => {
        let product = {}
        product.id = allProducts[key].ID;
        product.name = allProducts[key].Name;
        product.slogan = allProducts[key].Slogan;
        product.description = allProducts[key].Prod_Description;
        product.category = allProducts[key].Category;
        product.default_price = allProducts[key].Default_Price;
        formattedData.push(product)
      });
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
    let productPromise = q.queryProductById(productID)
    let featuresPromise = q.queryFeatures(productID);
    return Promise.all([productPromise, featuresPromise])
      .then(allData => {
        let product = allData[0]
        let features = allData[1]
        let formattedData = {
          id: product[0].ID,
          name: product[0].Name,
          slogan: product[0].Slogan,
          description: product[0].Prod_Description,
          category: product[0].Category,
          default_price: product[0].Default_Price,
          features: []
        }

        features.forEach(featureRowPacket => {
          let feature = {
            feature: featureRowPacket.Feature,
            value: featureRowPacket.Value
          }
          formattedData.features.push(feature)
        })
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
  let stylesData;
  let skusData;
  let skusPromises = []
  let photosPromises = [];
  let styleID;
  return new Promise((resolve, reject) => {
    q.queryProductStyles(productID)
    .then(results => {
      stylesData = results;
      for (let i = 0; i < stylesData.length; i++) {
        styleID = stylesData[i].ID;
        skusPromises.push(q.querySKUs(styleID));
      }
      return Promise.all(skusPromises)
    })
    .then(results => {
      skusData = results;
      for (let i = 0; i < stylesData.length; i++) {
        styleID = stylesData[i].ID;
        photosPromises.push(q.queryPhotos(styleID));
      }
      return Promise.all(photosPromises)
    })
    .then(photosData => {

      let formattedData = {
        product_id: `${productID}`,
        results: []
      }

      class StyleResultTemplate {
        constructor (styleId, name, originalPrice, salePrice, defaultStyle, photos, skus) {
          this.style_id = styleId,
          this.name = name,
          this.original_price = originalPrice,
          this.sale_price = salePrice,
          this['default?'] = defaultStyle,
          this.photos = photos
          this.skus = skus
        }
      }

      let SKUs = {}
      for (let i = 0; i < skusData.length; i++) {
        for (let j = 0; j < skusData[i].length; j++) {
          let sku = skusData[i][j]
          if (SKUs[sku.Style_ID] === undefined) {
            SKUs[sku.Style_ID] = {};
          }
          SKUs[sku.Style_ID][sku.ID] = {
            quantity: sku.Quantity,
            size: sku.Size
          }

        }
      }


      let photos = {}
      for (let i = 0; i < photosData.length; i++) {
        for (let j = 0; j < photosData[i].length; j++) {
          let photo = photosData[i][j];
          if (photos[photo.Style_ID] === undefined) {
            photos[photo.Style_ID] = [];
          }
          photos[photo.Style_ID].push({
            thumbnail_url: photo.Thumbnail_URL,
            url: photo.URL
          })
        }
      }

      let s = stylesData;
      for (let i = 0; i < s.length; i++) {
        let newResult = new StyleResultTemplate(s[i].ID, s[i].Name, s[i].Original_Price, s[i].Sale_Price, s[i].Default_Style, photos[`${s[i].ID}`], SKUs[`${s[i].ID}`]);
        formattedData.results.push(newResult);
      }
      console.log(formattedData)

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
    q.queryRelatedProducts(productID)
    .then(results => {
      let formattedData = results[0].Product_IDs
      resolve(JSON.parse(formattedData));
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