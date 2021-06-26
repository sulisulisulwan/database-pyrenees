const format = require('./etlFormat.js');

const ETL_TEMPLATE = (etlOptions) => {
  return new Promise((resolve, reject) => {
    let field;
    let isFirstLine = true;
    let keys = [];
    let buffer = 0;
    let rowCount = 0;
    let currentProductID = null;
    let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + etlOptions.csvPath, 'utf8')
    let readLine = rl.createInterface({
      input: readStream
    });
    let relatedProducts = [];

    readLine.on('line', (line) => {
      readLine.pause();
      if (isFirstLine) {
        isFirstLine = false;
        if (etlOptions.tableName === 'Related_Products') {
          return;
        } else {
          let keyCollection = format.formatForDatabase(line, undefined, isFirstLine)
          keyCollection.forEach(key => keys.push(key));
          isFirstLine = false;
        }
      } else {
        if (etlOptions.tableName === 'Related_Products') {
          let splitLine = line.split(',')
          if (splitLine[1] === currentProductID) {
            relatedProducts.push(Number(splitLine[2]))
            if (buffer === 0) {
              readLine.resume();
            }
            return;
          } else if (currentProductID === null) {
            currentProductID = splitLine[1];
            if (buffer === 0) {
              readLine.resume();
            }
            return;
          } else {
            let id = currentProductID;
            let loadRelatedProducts = JSON.stringify(relatedProducts)
            relatedProducts = [];
            field = {
              id: id,
              relatedProducts: loadRelatedProducts
            }
          }
        } else {
          field = format.formatForDatabase(line, keys, isFirstLine)
        }
        let q = etlOptions.query
        let v = etlOptions.fillQueryFunc(field);
        let insertField = () => {
          return new Promise((resolve, reject) => {
            db.query(q, v, (error, result) => {
              error ? reject(new Error(error)) : resolve(result);
            })
          })
        }
        buffer++;
        insertField()
        .then((result) => {
          buffer--;
          rowCount++;
          if (rowCount === etlOptions.targetRowCount) {
            resolve(`${etlOptions.csvPath} uploaded to SQL database`)
          }
          if (rowCount % 5000 === 0) {
            console.log(rowCount);
          }
          if (buffer === 0) {
            readLine.resume();
          }
        })
        .catch((error) => {
          console.log(error)
        })
      }
      //reject(`${etlOptions.csvPath} FAILED to upload to SQL database`)
    })
  })
}

module.exports = {
  ETL_TEMPLATE: ETL_TEMPLATE
}