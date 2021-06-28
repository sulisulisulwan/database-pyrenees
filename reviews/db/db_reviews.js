const mysql = require('mysql2/promise');
const bluebird = require('bluebird');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'chillara',
  database: 'SDC',
  connectionLimit: 5
});

module.exports.getNReviews = (id, n, sort) => {
  return pool.query(`SELECT * FROM reviews where product_id=${id} AND reported=1 ORDER BY ${sort} DESC LIMIT ${n}`);
}

module.exports.getAllReviews = (id, n, sort) => {
  return pool.query(`SELECT rating, recommend FROM reviews where product_id=${id} AND reported=1 ORDER BY id DESC`);
}

module.exports.getPhotos = (id) => {
  return pool.query('SELECT reviews.id, product_id, url FROM reviews LEFT JOIN photos ON '
  + `reviews.id = photos.review_id WHERE product_id=${id}`);
}

module.exports.getCharacteristics = (id) => {
  return pool.query('SELECT characteristics.id, product_id, name, value FROM characteristics LEFT JOIN '
  + `characteristics_reviews ON characteristics.id = characteristics_reviews.characteristic_id WHERE product_id=${id}`);
}

module.exports.addAReview = (array) => {
  return pool.query('INSERT INTO REVIEWS (product_id, rating, date, summary, body, recommend,'
  + 'reported, reviewer_name, reviewer_email, response, helpfullness) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', array);
}

module.exports.addAPhoto = (array) => {
  return pool.query('INSERT INTO PHOTOS (review_id, url) VALUES (?, ?)', array);
}

module.exports.addACharacteristicsReviews = (array) => {
  return pool.query('INSERT INTO characteristics_reviews (characteristic_id, review_id, value) VALUES (?, ?, ?)', array);
}

module.exports.reportAReview = (id) => {
  return pool.query(`UPDATE reviews SET reported=0 WHERE id=${id}`);
}

module.exports.incrementHelpfulness = (id) => {
  return pool.query(`UPDATE reviews SET helpfullness=helpfullness+1 WHERE id=${id}`);
}

module.exports.lastInsertId = () => {
  return pool.query('SELECT LAST_INSERT_ID()s');
}

// mysql_query("
//     UPDATE member_profile
//     SET points = points + 1
//     WHERE user_id = '".$userid."'
// ");

// UPDATE table_name
// SET column1 = value1, column2 = value2, ...
// WHERE condition;



// module.exports.getNReviews = (id, n, sort, cb) => {
//   connection.query(`SELECT * FROM reviews where product_id=${id} ORDER BY id DESC LIMIT ${n}`, (err, result) => {
//     if (err) {
//       cb(err);
//     } else {
//       cb(null, result);
//     }
//   })
// }

// module.exports.getPhotos = (id, cb) => {
//   return connection.execute(`SELECT * FROM reviews where product_id=${id} ORDER BY id DESC LIMIT ${n}`, (err, result) => {
//     if (err) {
//       cb(err);
//     } else {
//       cb(null, result);
//     }
//   })
// }

// module.exports.insertIntoReviews = (array) => {
//   connection.execute(
//     'INSERT INTO REVIEWS'
//     + '(id, product_id, rating, date, summary, body, recommend,'
//     + 'reported, reviewer_name, reviewer_email, response, helpfullness) '
//     + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', array,
//     (err, results) => {
//       if (err) {
//         console.log(err);
//       } else {
//         // console.log('inserted!!');
//       }
//     }
//   );
// };