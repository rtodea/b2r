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

    it('should work', () => {
      expect(generatedFiles).to.have.lengthOf(2);
    });
  });
});
