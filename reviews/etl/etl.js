const fs = require('fs');
const csv = require('csv-parser');
const db = require('../db/db.js');

var reviews = __dirname + '/../../../DATA/reviews.csv';

const results = [];

fs.createReadStream(reviews)
  .pipe(csv({}))
  .on('data', (data) => {
    //parse data that needs to be parsed
    let parsedProductId = Number(data.id);
    let parsedRating = Number(data.rating);
    let parsedRecommend = Boolean(data.recommend);
    let parsedReported = Boolean(data.reported);
    let parsedHelpfulness = Number(data.helpfulness);
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
      parsedProductId,
      parsedRating,
      parsedDateString,
      data.summary,
      data.body,
      parsedRecommend,
      parsedReported,
      data.reviewer_name,
      data.reviewer_email,
      parsedResponse,
      parsedHelpfulness
    ];
    //load it into the database!!
    db.insertIntoReviews(transformedData);
    // console.log(transformedData);

  })
  .on('end', () => {
    console.log(results);
  });