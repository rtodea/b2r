const program = require('commander');
const R = require('ramda');

const packageInfo = require('../package.json');
const csv = require('./csv');
const converter = require('./converter');


function run(csvFilePath) {
  const blueTickets = csv.read(csvFilePath);
  const blueTicketsByBlueProjectType = converter.split(blueTickets);
  const redTicketsByBlueProjectType = R.map(
    (tickets) => (tickets.map(converter.convert)), blueTicketsByBlueProjectType);
  const redTicketsByRedProjectTypes = converter.toRedProjectTypes(redTicketsByBlueProjectType);
  const generatedFiles = [];
  R.toPairs(redTicketsByRedProjectTypes)
    .filter(([k, v]) => (v.length > 0))
    .forEach(([k, v]) => {
      const fileName = createFileName(k);
      csv.write(v, fileName);
      generatedFiles.push(fileName);
    });

  return generatedFiles;
}


function createFileName(base) {
  return `${base}.csv`;
}


function setup() {
  let csvFile = null;

  program
    .version(packageInfo.version)
    .description(packageInfo.description)
    .arguments('<exportedCsvFile> ')
    .action((exportedCsvFile) => { csvFile = exportedCsvFile; })
    .parse(process.argv);


  program.on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ npm start exportData.csv');
    console.log('');
  });

  return csvFile;
}


if (require.main === module) {
  const csvFilePath = setup();
  run(csvFilePath);
}


module.exports = run;
