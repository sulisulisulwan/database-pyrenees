const Promise = require("bluebird");


const reviews = require('./etl_reviews.js');
const photos = require('./etl_photos.js');
const characteristics = require('./etl_characteristics.js');
const characteristicsReviews = require('./etl_characteristics_reviews');

// const reviewPromise = Promise.promisify(reviews.etlReview);
// const photosPromise = Promise.promisify(photos.etlPhotos);
// const charsPromise = Promise.promisify(characteristics.etlCharacteristics);
// const charsReviewsPromise = Promise.promisify(characteristicsReviews.etlCharacteristicReviews);

// reviewPromise()
// .then(() => {
//   photosPromise();
// })
// .then(() => {
//   charsPromise();
// })
// .then(() => {
//   charsReviewsPromise();
// })
// .then(() => {
//   console.log('fin!!');
// })

// reviews.etlReview()
// .then(() => {
//   console.log('test');
// })
// photos.etlPhotos();
// characteristics.etlCharacteristics();
characteristicsReviews.etlCharacteristicReviews();
