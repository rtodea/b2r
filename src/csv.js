const fs = require('fs');
const parse = require('csv-parse/lib/sync');


function read(fileName) {
  const fileContent = fs.readFileSync(fileName).toString();
  return parse(fileContent, { columns: true });
}


function write(data, fileName) {

}


module.exports = {
  read,
  write,
};
