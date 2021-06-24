const fs = require('fs');
const csv = require('csv-parser');
const db = require('../db/db_characteristics.js');

var characteristics = __dirname + '/../../../DATA/characteristics.csv';

const etlCharacteristics = () => {
  const readable = fs.createReadStream(characteristics);
  readable
  .pipe(csv({}))
  .on('data', (data) => {
    //put it in array
    let transformedData = [Number(data.id), Number(data.product_id), data.name];
    // console.log(transformedData);
    db.insertIntoCharacteristics(transformedData);
  })
  .on('data', () => {
    readable.pause();
    setTimeout(() => {
      // console.log('Now data starts flowing again.');
      readable.resume();
    }, 6000);
  })
  .on('end', () => {
    console.log('INSERTED ALL CHARACTERISTICS INTO PHOTOS!!!!!!!!!!!!');
  });
}

module.exports.etlCharacteristics = etlCharacteristics;