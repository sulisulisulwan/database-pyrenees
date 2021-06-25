const mysql = require('mysql2');
const bluebird = require('bluebird');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'chillara',
  database: 'SDC',
});

module.exports.getNReviews = (id, n, cb) => {
  connection.execute(`SELECT * FROM reviews where product_id=${id} ORDER BY id DESC LIMIT ${n}`, (err, result) => {
    if (err) {
      cb(err);
    } else {
      cb(null, result);
    }
  })
}

module.exports.insertIntoReviews = (array) => {
  return connection.execute(
    'INSERT INTO REVIEWS'
    + '(id, product_id, rating, date, summary, body, recommend,'
    + 'reported, reviewer_name, reviewer_email, response, helpfullness) '
    + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', array,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        // console.log('inserted!!');
      }
    }
  );
};