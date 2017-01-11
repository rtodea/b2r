const program = require('commander');
const fs = require('fs');
const R = require('ramda');

const packageInfo = require('../package.json');
const csv = require('./csv');
const converter = require('./converter');
const constants = require('./constants');


function run(csvFilePath, timesheetJsonPath, userType) {
  const blueTickets = csv.read(csvFilePath).slice(0, -1);
  const blueTicketsByBlueProjectType = converter.split(blueTickets);
  const redTicketsByBlueProjectType = R.map(
    (tickets) => (tickets.map((input) => converter.convert(input, userType))), blueTicketsByBlueProjectType);
  const redTicketsByRedProjectTypes = converter.toRedProjectTypes(redTicketsByBlueProjectType);
  const timesheetMap = JSON.parse(fs.readFileSync(timesheetJsonPath, 'utf8'));
  const redTickets = converter.generateRedTicketsWithTimesheetInfo(redTicketsByRedProjectTypes, timesheetMap);

  const generatedFile = 'time-entries.csv';
  csv.write(redTickets, generatedFile, R.values(constants.red));

  return generatedFile;
}


function setup() {
  let csvFile = null;
  let timesheetMap = null;

  program
    .version(packageInfo.version)
    .description(packageInfo.description)
    .arguments('<exportedCsvFile> <timesheetMapJsonFile>')
    .action((exportedCsvFile, timesheetMapJsonFile) => {
      csvFile = exportedCsvFile;
      timesheetMap = timesheetMapJsonFile;
    })
    .parse(process.argv);


  program.on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ npm start exportData.csv');
    console.log('');
  });

  return [csvFile, timesheetMap];
}


if (require.main === module) {
  const [csvFilePath, jsonFilePath] = setup();
  const generatedFile = run(csvFilePath, jsonFilePath);
  console.log('Generated', generatedFile);
}


module.exports = run;
