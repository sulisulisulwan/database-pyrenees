const mysql = require('mysql2');
const bluebird = require('bluebird');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'chillara',
  database: 'SDC',
});


module.exports.insertIntoCharacteristicsReviews = (array) => {
  return connection.execute(
    'INSERT INTO characteristics_reviews (id, characteristic_id, review_id, value) VALUES (?, ?, ?, ?)', array,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        // console.log('inserted!!');
      }
    }
  );
};