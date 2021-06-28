const mysql = require('mysql2');
const bluebird = require('bluebird');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'chillara',
  database: 'SDC',
});

module.exports.getPhotos = (id) => {
  return pool.query(`SELECT reviews.id, product_id, url FROM reviews LEFT JOIN photos ON reviews.id = photos.review_id WHERE product_id=${id}`);
}

module.exports.insertIntoPhotos = (array) => {
  return connection.execute(
    'INSERT INTO PHOTOS (id, review_id, url) VALUES (?, ?, ?)', array,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        // console.log('inserted!!');
      }
    }
  );
};