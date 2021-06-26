const express = require('express')
const models = require('./models/models.js');
const port = 3000
const app = express();
app.use(express.json())
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})


/**********************************
 *
 *             ROUTES
 *
 *********************************/

app.get('/products', (req, res) => {
  let pageAndCount = {
    page: '1',
    count: '5'
  }
  let params = req.url.replace('/products/', '')
  params = params.replace('?', '').split('&')
  params.forEach(param => {
    param = param.split('=');
    pageAndCount[param[0]] = param[1];
  })
  pageAndCount.count = (Number(pageAndCount.count) > 10 || pageAndCount.count === '')? '10' : pageAndCount.count;
  checkForError('products', pageAndCount.page, res)
  models.getAllProducts(pageAndCount)
  .then(result => {
    res.status(200)
    .json(result)
  })
  .catch(error => {
    res.sendStatus(500)
  })
})


app.get('/products/:product_id', (req, res) => {
  let id = req.url.replace('/products/', '')
  checkForError('productId', id, res)
  models.getProductById(id)
  .then(result => {
    res.status(200).json(result)
  })
  .catch(error => {
    console.log(new Error(error))
    res.sendStatus(500);
  })
})


app.get('/products/:product_id/styles', (req, res) => {
  let id = req.url.replace('/products/', '').replace('/styles', '');
  checkForError('styles', id, res)
  models.getProductStyles(id)
  .then(result => {
    res.status(200).json(result);
  })
  .catch(error => {
    console.log(new Error(error))
    res.sendStatus(500)
  })
})


app.get('/products/:product_id/related', (req, res) => {
  let id = req.url.replace('/products/', '').replace('/related', '');
  checkForError('related', id, res);
  models.getRelatedProducts(id)
  .then(result => {
    res.status(200).json(result);
  })
  .catch(error => {
    console.log(new Error(error))
    res.sendStatus(500)
  })
})


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