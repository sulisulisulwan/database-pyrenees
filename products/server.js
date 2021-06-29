const express = require('express')
const models = require('./models/models.js');
const port = 3000
const app = express();


app.use(express.json())
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})




let cache = {
  products: {},
  productID: {},
  styles: {},
  related: {},
};
/**********************************
 *             ROUTES
 *********************************/

app.get('/products', (req, res) => {
  let pageAndCount = {
    page: '1',
    count: '5'
  }
  let params = req.url.replace('/products/', '')
  params = params.replace('?', '').split('&')
  if (params[0] !== '') {
    params.forEach(param => {
      param = param.split('=');
      pageAndCount[param[0]] = param[1];
    })
  }
  pageAndCount.count = (Number(pageAndCount.count) > 10 || pageAndCount.count === '')? '10' : pageAndCount.count;
  let cacheKey = `${pageAndCount.page}:${pageAndCount.count}`
  checkForError('products', pageAndCount.page, res)
  if (cache.products[cacheKey]) {
    res.status(200).json(cache.products[cacheKey])
  } else {
    models.getAllProducts(pageAndCount)
    .then(result => {
      cache.products[cacheKey] = result
      res.status(200).json(result)
    })
    .catch(error => {
      console.log('also here')
      res.sendStatus(500)
    })
  }
})


app.get('/products/:product_id', (req, res) => {

  let id = req.url.replace('/products/', '')
  if (cache[id]) {
  checkForError('productId', id, res)
    res.status(200).json(cache[id]);
  } else {
    models.getProductById(id)
    .then(result => {
      cache[id] = result
      res.status(200).json(result)
    })
    .catch(error => {
      console.log(new Error(error))
      res.sendStatus(500);
    })
  }
})


app.get('/products/:product_id/styles', (req, res) => {
  let id = req.url.replace('/products/', '').replace('/styles', '');
  checkForError('styles', id, res)
  if (cache.styles[id]) {
    res.status(200).json(cache.styles[id])
  } else {
    models.getProductStyles(id)
    .then(results => {
      cache.styles[id] = results
      res.status(200).json(results);
    })
    .catch(error => {
      console.log(new Error(error))
      res.sendStatus(500)
    })
  }
})


app.get('/products/:product_id/related', (req, res) => {
  let id = req.url.replace('/products/', '').replace('/related', '');
  checkForError('related', id, res);
  if (cache.related[id]) {
    res.status(200).json(cache.related[id]);
  } else {
    models.getRelatedProducts(id)
    .then(result => {
      cache.related[id] = result;
      res.status(200).json(result);
    })
    .catch(error => {
      console.log(new Error(error))
      res.sendStatus(500)
    })
  }
})


/////////////////////////////////////////////////////////////////

const checkForError = (endpoint, val, res) => {
  let err422 = 'invalid query parameter'
  let err416 = 'product does not exist'
  if (endpoint === 'productId' || endpoint === 'styles' || endpoint === 'related') {
    try {
      if (Number.isNaN(Number(val))) {
        throw(err422)
      } else if (Number(val) < 1 || Number(val) > 1000011) {
        throw(err416)
      }
    }
    catch (error) {
      if (error === err422) {
        res.sendStatus(422);
      } else if (error === err416) {
        res.sendStatus(416);
      }
    }
  } else {
    if (val < 1 || val > 100002) {
      res.sendStatus(416);
    }
  }
  return;
}