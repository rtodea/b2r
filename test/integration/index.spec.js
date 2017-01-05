const fs = require('fs');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const expect = chai.expect;

const sut = require('../../src/index');


describe('index', () => {
  describe('a typical export', () => {
    const filePath = './test/integration/samples/typical-export.csv';
    let generatedFiles;
    before(() => {
      generatedFiles = sut(filePath);
    });

    after(() => {
      generatedFiles.forEach((file) => {
        fs.unlinkSync(file);
      });
    });

    it('should generate 2 files', () => {
      expect(generatedFiles).to.have.lengthOf(2);
      expect(generatedFiles[0]).to.eql('RSCR.csv');
      expect(generatedFiles[1]).to.eql('FLTSTA.csv');
    });

    it('should have the correct order of the columns', () => {
      const generatedContent = fs.readFileSync(generatedFiles[0]).toString();
      expect(generatedContent.split('\n')[0].split(',')).to.eql([
        '"Date"',
        '"Task Code ID"',
        '"Jira Number"',
        '"Task Description"',
        '"Hours"',
      ]);
    });
  });
});
