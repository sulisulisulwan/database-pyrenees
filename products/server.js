const express = require('express')
const port = 3000
const app = express();
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})
app.use(express.json())

///products

app.get('/products', (req, res) => {
  res.sendStatus(200)
})
//
///produgcts/<productID>
app.get('/products/:product_id', (req, res) => {
  console.log(req.params)

  res.sendStatus(200)
})
///products/<productID>/styles
app.get('/products/:product_id/styles', (req, res) => {
  console.log(req.params)

  res.sendStatus(200)
})
///related
app.get('/products/:product_id/related', (req, res) => {
  console.log(req.params)

  res.sendStatus(200)
})