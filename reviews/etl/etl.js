const fs = require('fs');
const csv = require('csv-parser');
const db = require('../db/db.js');

var reviews = __dirname + '/../../../DATA/reviews.csv';

const results = [];

fs.createReadStream(reviews)
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
    // console.log(transformedData);
  })
  .on('end', () => {
    console.log('INSERTED ALL REVIEWS INTO DATABASE!!!!!!!!!!!!');
  });