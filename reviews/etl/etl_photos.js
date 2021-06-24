const fs = require('fs');
const csv = require('csv-parser');
const db = require('../db/db_photos.js');

var photos = __dirname + '/../../../DATA/reviews_photos.csv';

const etlPhotos = () => {
  const readable = fs.createReadStream(photos);
  readable
  .pipe(csv({}))
  .on('data', (data) => {
    //put it in array
    let transformedData = [Number(data.id), Number(data.review_id), data.url];
    db.insertIntoPhotos(transformedData);
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

etlPhotos();