const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const expect = chai.expect;

const converter = require('../../src/converter');


describe('convertor.split', () => {
  const sut = converter.split;

  it('should have an empty object for empty input', () => {
    expect(sut([])).to.eql({});
  });

  it('should handle special tickets when provided', () => {
    const tickets = [{ Key: '1' }];
    expect(sut(tickets, { special: ['1'] })).to.eql({
      special: tickets,
    });
  });

  it('should put tickets that have empty values in "Project" or "Billing - Project" into no project grouping', () => {
    const tickets = [{ Project: '' }, { 'Billing - Project': '' }, {}];
    expect(sut(tickets)).to.eql({
      noProject: tickets,
    });
  });

  it('should group tickets by project name', () => {
    const tickets = [
      { Project: 'P1' },
      { 'Billing - Project': 'P2', Project: 'P1' },
      { Project: 'P1', Key: '1' },
    ];
    expect(sut(tickets, { special: ['1'] })).to.eql({
      P1: [tickets[0]],
      P2: [tickets[1]],
      special: [tickets[2]],
    });
  });
});
