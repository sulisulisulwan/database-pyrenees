const express = require('express')
const models = require('./models.js');
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
  pageAndCount.count = Number(pageAndCount.count) > 10 ? '10' : pageAndCount.count;

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

  //deal with edge cases where the input params are not valid OR
  //id number is not found in database

  let id = req.url.replace('/products/', '')
  models.getProductById(id)
  .then(result => {
    res.status(200).json(result)
  })
  .catch(error => {
    console.log(new Error(error))
    res.sendStatus(500)
  })
})


app.get('/products/:product_id/styles', (req, res) => {
  let id = req.url.replace('/products/', '').replace('/styles', '');
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
  models.getRelatedProducts(id)
  .then(result => {
    res.status(200).json(result);
  })
  .catch(error => {
    console.log(new Error(error))
    res.sendStatus(500)
  })
})