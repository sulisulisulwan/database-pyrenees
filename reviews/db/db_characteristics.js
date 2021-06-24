const mysql = require('mysql2');
const bluebird = require('bluebird');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'chillara',
  database: 'SDC',
});


module.exports.insertIntoCharacteristics = (array) => {
  return connection.execute(
    'INSERT INTO characteristics (id, product_id, name) VALUES (?, ?, ?)', array,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        // console.log('inserted!!');
      }
    }
  );
};