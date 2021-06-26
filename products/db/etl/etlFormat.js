let formatForDatabase = (line, preexistingKeys, isFirstLine) => {
  let keys = []
  let tableEntry = {}
  let field = line.split(',')

  if (isFirstLine === true) {
    field.forEach(key => keys.push(key))
    return keys;
  }
  keys = preexistingKeys
  let id = field[0]
  tableEntry[id] = {};
  let value;
  keys.forEach((key, i) => {
    value = (
      key === 'url'
      || key === 'thumbnail_url'
      || key === 'name'
      || key === 'sale_price'
      || key === 'original_price'
      || key === 'default_price'
      || key === 'size'
      || key === 'slogan'
      || key === 'description'
      || key === 'category'
      || key === 'feature'
      || key === 'value'
      ) ? field[i].replace('"', '').replace('"', '')
      : (key === 'id' || key === 'style_id' || key === 'quantity' || 'productId') ? Number(field[i])
      : key === 'default?' ? ((field[i] === 'true') ? true : false)
      : field[i];
    tableEntry[id][key] = value;
  });
  return tableEntry;
}

module.exports = {
  formatForDatabase: formatForDatabase
}