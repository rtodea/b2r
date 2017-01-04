const fs = require('fs');
const parse = require('csv-parse/lib/sync');
const json2csv = require('json2csv');


function read(fileName) {
  const fileContent = fs.readFileSync(fileName).toString();
  return parse(fileContent, { columns: true });
}


function write(tickets, fileName) {
  const csvContent = json2csv({ data: tickets });
  fs.writeFileSync(fileName, csvContent);
}


module.exports = {
  read,
  write,
};
