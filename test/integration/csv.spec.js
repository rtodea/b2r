const fs = require('fs');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const expect = chai.expect;

const csv = require('../../src/csv');


describe('csv', () => {
  describe('read', () => {
    describe('a typical export', () => {
      let parsedData;
      before(() => {
        const filePath = './test/integration/samples/typical-export.csv';
        parsedData = csv.read(filePath);
      });

      it('should have correct number of rows', () => {
        expect(parsedData).to.have.lengthOf(15);
      });

      it('should have an array of objects with column names as keys', () => {
        const relevantKeys = [
          'Key',
          'Summary',
          'Project',
          'Billing - Project',
          'Date Started',
          'Time Spent (h)',
        ];
        const allKeys = Object.keys(parsedData[0]);
        expect(allKeys).to.containSubset(relevantKeys);
      });

      it('should have on the last row the total hours', () => {
        const mismatchedKey = 'Project';
        const lastEntry = 14;
        expect(parsedData[lastEntry][mismatchedKey]).to.eql('Total');
      });
    });
  });

  describe('write', () => {
    const toBeExported = [{
      firstColumn: 'firstValue',
      secondColumn: 'secondValue',
    }];

    const sut = csv.write;
    const outputFile = 'some-file.csv';

    afterEach(() => {
      fs.unlinkSync(outputFile);
    });

    it('should create a file with the correct contents', () => {
      sut(toBeExported, outputFile);
      const parsedData = csv.read(outputFile);
      expect(parsedData).to.have.lengthOf(1);
      expect(parsedData[0]).to.eql({
        firstColumn: 'firstValue',
        secondColumn: 'secondValue',
      });
    });
  });
});
