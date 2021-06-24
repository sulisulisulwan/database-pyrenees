const fsPromise = require('fs/promises')
const path = require('path');



const SKUS_ETL = () => {
  return new Promise ((resolve, reject) => {
    let relatedProducts = {};
    let keys = [];
    let field;
    let isFirstLine = true;
    let buffer = 0
    let errors = [];
    let rowsInserted;
    let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + 'raw_data/related.csv', 'utf8')
    let readLine = rl.createInterface({
        input: readStream
    });

    readLine.on('line', (line) => {
      errors.push(line)
      readLine.pause();
        if (isFirstLine) {
          let keyCollection = etl.formatForDatabase(line, undefined, isFirstLine)
          keyCollection.forEach(key => keys.push(key));
          isFirstLine = false;
          readLine.resume()
        } else {
          field = etl.formatForDatabase(line, keys, isFirstLine)
          let id = Number(Object.keys(field)[0]);
          let Product_IDs = field[id].Product_IDs
          let q = `INSERT INTO Products (ID, Product_IDs) VALUES (?, ?)`;
          let v = [id, Product_IDs]
          let insertField = () => {
            return new Promise((resolve, reject) => {
              db.query(q, v, (error, result) => {
                if (error) {
                  reject(new Error(error))
                } else {
                  console.log(result)
                  rowsInserted = result.insertId
                  resolve(result);
                }
              })
            })
          }
          insertField()
          .then((result) => {
            console.log(result);
            if (buffer > 200) {
              buffer = 0;
              readLine.resume();
            } else {
              console.log(buffer)
              buffer++;
            }
          })
          .catch((error) => {
            errors.push(JSON.stringify(error))
          })
        }
    })

    readLine.on('close', () => {
      if (rowsInserted === 4508264) {
        resolve('product.csv uploaded to SQL database')
      } else {
        reject('product.csv failed to properly load to SQL database')
      }
    });
  }
}













const RELATED_PRODUCTS_ETL = () => {
  return new Promise ((resolve, reject) => {
    let relatedProducts = {};
    return fsPromise.readFile(__dirname.substring(0, __dirname.length - 3) + 'raw_data/related.csv', 'utf8')
    .then(result => {
      result.split('\n').forEach(item => {
        let splitItem = item.split(',')
        if (relatedProducts[splitItem[1]] === undefined) {
          relatedProducts[splitItem[1]] = []
        }
        relatedProducts[splitItem[1]].push(splitItem[2]);
      });
      for (let key in relatedProducts) {
        relatedProducts[key] = JSON.stringify(relatedProducts[key])
        // relatedProducts[key] = relatedProducts[key].join('_')
      }
      resolve(relatedProducts)
    })
    .catch(error => {
      reject(error);
    })
  });
}
module.exports = RELATED_PRODUCTS_ETL;