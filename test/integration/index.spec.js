const fs = require('fs');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const R = require('ramda');

chai.use(chaiSubset);
const expect = chai.expect;

const sut = require('../../src/index');


describe('index', () => {
  describe('a typical export', () => {
    const filePath = './test/integration/samples/typical-export.csv';
    const jsonPath = './test/integration/samples/typical-timesheet-ids.json';

    let generatedFile;
    before(() => {
      generatedFile = sut(filePath, jsonPath);
    });

    after(() => {
      fs.unlinkSync(generatedFile);
    });

    it('should generate 1 file', () => {
      expect(generatedFile).to.eql('time-entries.csv');
    });

    describe('content', () => {
      let generatedContent = null;
      before(() => {
        generatedContent = fs.readFileSync(generatedFile).toString();
      });

      it('should have the correct order of the columns', () => {
        expect(generatedContent.split('\n')[0].split(',')).to.eql([
          '"Date"',
          '"Task Code ID"',
          '"Jira Number"',
          '"Task Description"',
          '"Hours"',
          '"Related Timesheet"',
        ]);
      });

      it('should have the correct related timesheet as suplied', () => {
        const rows = R.slice(1, Infinity, generatedContent.split('\n'));
        const timesheetIds = R.pipe(
          R.map((row) => {
            const cells = row.split(',');
            return `${cells[5]}`;
          }),
          R.uniq
        )(rows);
        expect(timesheetIds).to.containSubset(['1001', '1002']);
      });
    });
  });
});
