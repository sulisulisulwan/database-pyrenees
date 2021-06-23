const mysql = require('mysql2');
const bluebird = require('bluebird');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'chillara',
  database: 'SDC',
});


module.exports.insertIntoReviews = (array) => {
  connection.execute(
    'INSERT INTO REVIEWS'
    + '(product_id, rating, date, summary, body, recommend,'
    + 'reported, reviewer_name, reviewer_email, response, helpfullness) '
    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', array,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log('inserted!!');
      }
    }
  );
};