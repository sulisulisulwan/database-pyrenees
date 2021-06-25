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
  models.getAllProducts()
  .then(result => {
    console.log(result)//EXPECT result to be 'TODO:'
    res.sendStatus(200)
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
  })
})