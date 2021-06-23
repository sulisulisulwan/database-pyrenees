const fsPromise = require('fs/promises')
const path = require('path');


//pull in data from raw_data.related.csv
//TEST
//what happens when we convert the whole thing to a string?

let relatedProducts = {};

return fsPromise.readFile(__dirname.substring(0, __dirname.length - 3) + 'raw_data/related.csv', 'utf8')
.then(result => {
  let splitResult = result.split('\n')

  splitResult.forEach(item => {
    let splitItem = item.split(',')
    //if relatedProducts[itemData[1]] is undefined
    if (relatedProducts[splitItem[1]] === undefined) {
      //set relatedProducts[itemData[1]] to an array
      relatedProducts[splitItem[1]] = []
    }
    //push into relatedProducts[itemData[1]] itemData[2]
    relatedProducts[splitItem[1]].push(splitItem[2]);
  })


  //for each key in relatedProducts
  for (let key in relatedProducts) {
    //join the array relatedProducts[key] with '_'
    relatedProducts[key] = relatedProducts[key].join('_')
  }
  console.log(relatedProducts)
})
.catch(error => {
  console.error(error);
})



module.exports = relatedProducts;