const fs = require('fs');
const csv = require('csv-parser');
const db = require('../db/db_characteristics_reviews.js');

var characteristicReviews = __dirname + '/../../../DATA/characteristic_reviews.csv';

const etlCharacteristicReviews = () => {
  const readable = fs.createReadStream(characteristicReviews);
  readable
  .pipe(csv({}))
  .on('data', (data) => {
    //put it in array
    let transformedData = [Number(data.id), Number(data.characteristic_id), Number(data.review_id), Number(data.value)];
    // console.log(transformedData);
    db.insertIntoCharacteristicsReviews(transformedData);
  })
  .on('data', () => {
    readable.pause();
    setTimeout(() => {
      console.log('Now data starts flowing again.');
      readable.resume();
    }, 15000);
  })
  .on('end', () => {
    console.log('INSERTED ALL REVIEWS INTO PHOTOS!!!!!!!!!!!!');
  });
}

etlCharacteristicReviews();