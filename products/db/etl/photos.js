const fs = require('fs');
const path = require('path');
const etl = require('./etl.js');



// // const PHOTOS_ETL = new Promise ((resolve, reject) => {

let photos = {};
let chunkCount = 0;
let photosArray = [];
let keys;
let readStream = fs.createReadStream(__dirname.substring(0, __dirname.length - 3) + 'raw_data/photos.csv', 'utf8')
readStream.on('data', (chunk) => {
  // setTimeout(() => {
    readStream.pause()
    let readThis = chunk.split('\n')
    let result;
    if (chunkCount === 0) {
      result = etl.formatForDatabase(chunk)
      keys = Object.keys(result['1'])
    } else {
      result = etl.formatForDatabase(chunk, keys)
    }
    for (let id in result) {
      keys.forEach(key => {
        if (photos[id] === undefined) {
          photos[id] = {}
        }
        photos[id][key] = result[id][key]});
    }
    chunkCount++

    //POSSIBLY PUT THESE INTO DATABASE

    console.log(result)

    // readStream.resume();
  // }, 4000)

})

readStream.on('end', () => {
  console.log(photos)
  // console.log('STREAM COMPLETED')
  // let photos = formatForDatabase(data);
  // console.log('FORMATTED')
  // console.log(Object.keys(photos).length)
})



// module.exports = PHOTOS_ETL;