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
  // console.log(req.params)
  models.getProductById(10011)
  .then(result => {
    console.log(result)//EXPECT result to be 'TODO:'
    res.sendStatus(200)
  })
  .catch(error => {
    console.log(new Error(error))
    res.sendStatus(500)
  })
})


app.get('/products/:product_id/styles', (req, res) => {
  // console.log(req.params)
  models.getProductStyles(10011)
  .then(result => {
    console.log(result)//EXPECT result to be {product_id: 'something', results: []}
    res.sendStatus(200)
  })
  .catch(error => {
    console.log(new Error(error))
    res.sendStatus(500)
  })
})


app.get('/products/:product_id/related', (req, res) => {
  // console.log(req.params)
  models.getRelatedProducts(10011)
  .then(result => {
    console.log(result)//EXPECT result to be ['TODO:']
    res.sendStatus(200)
  })
  .catch(error => {
    console.log(new Error(error))
    res.sendStatus(500)
  })
})