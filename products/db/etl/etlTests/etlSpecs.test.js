
const format = require('../etlFormat.js');
const template = require('../etlTemplate.js');
const templateOptions = require('../etlTemplateOptions.js');
const fs = require('fs')
const rl = require('readline')


let testIndex = 0;
let testValues = [
  {
    id: 1,
    relatedProducts: '[2,3,8,7]'
  },
  {
    id: 2,
    relatedProducts: '[3,7,6,5]'
  },
  {
    id: 3,
    relatedProducts: '[5,9,7,2,1]'
  },
  {
    id: 4,
    relatedProducts: '[1,2,4,5,8]'
  }
]
let testCSVPath = 'relatedTest.csv'
test('format.RelatedProducts and etlOptions.Related_Products formats CSV file line correctly', ()=>{



  let field, currentProductID, proceed;
  let isFirstLine = true;
  let buffer = 0;
  let rowCount = 0;
  let keys = [];
  let relatedProducts = [];
  let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + testCSVPath, 'utf8')
  let readLine = rl.createInterface({
    input: readStream
  });


  readLine.on('line', (line) => {
    readLine.pause();
    if (isFirstLine) {
      isFirstLine = false;
      line = line.split(',')
      keys = etlOptions.tableName === 'Related_Products' ? [] : line.map(key => key)
    } else {
      if (etlOptions.tableName === 'Related_Products') {
        [relatedProducts, field, proceed, currentProductID] = format.relatedProducts(line, relatedProducts, currentProductID);
        if (buffer === 0) {
          readLine.resume();
        }
        if (!proceed) {
          return;
        }
      } else {
        field = format.productsStylesFeaturesPhotosSKUS(line, keys)
      }
      let needIntermediaryQuery = etlOptions.tableName === 'SKUs' || etlOptions.tableName === 'Photos' ? true : false;
      let values = etlOptions.fillValues(field)
      console.log(format)
      expect(JSON.stringify(values) === JSON.stringify(testValues[testIndex]))
      testId++
    }
  });
});



