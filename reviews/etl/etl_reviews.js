const fs = require('fs');
const csv = require('csv-parser');
const db = require('../db/db_reviews.js');

var reviews = __dirname + '/../../../DATA/reviews.csv';

var results = [];

const etlReview = () => {
  const readable = fs.createReadStream(reviews);
  readable
  .pipe(csv({}))
  .on('data', (data) => {
    //format date
    let temp = Date(data.date);
    let date = new Date(temp);
    let parsedDateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];
    //parse response
    let parsedResponse = data.response;
    if (parsedResponse === 'null') {
      parsedResponse = null;
    }
    //put it in array
    let transformedData =
    [
      Number(data.id),
      Number(data.product_id),
      Number(data.rating),
      parsedDateString,
      data.summary,
      data.body,
      Boolean(data.recommend),
      Boolean(data.reported),
      data.reviewer_name,
      data.reviewer_email,
      parsedResponse,
      Number(data.helpfulness)
    ];
    //load it into the database!!
    db.insertIntoReviews(transformedData);
    // results.push(transformedData);
    // console.log(results.length);
    // // this.pause();
  })
  .on('data', () => {
    readable.pause();
    setTimeout(() => {
      // console.log('Now data starts flowing again.');
      readable.resume();
    }, 20000);
  })
  .on('end', () => {
    console.log('INSERTED ALL REVIEWS INTO DATABASE!!!!!!!!!!!!');
  });
}

module.exports.etlReview = etlReview;