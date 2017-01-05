const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const expect = chai.expect;

const converter = require('../../src/converter');


describe('converter.split', () => {
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
      { Project: 'ALG HUD' },
      { 'Billing - Project': 'ALG Resources', Project: 'ALG HUD' },
      { Project: 'ALG HUD', Key: '1' },
    ];
    expect(sut(tickets, { special: ['1'] })).to.eql({
      HUD: [tickets[0]],
      ARES: [tickets[1]],
      special: [tickets[2]],
    });
  });

  it('should sort the tickets in a group by date', () => {
    const tickets = [
      { Project: 'ALG HUD', 'Date Started': '2016-12-20 14:18:00' },
      { Project: 'ALG HUD', 'Date Started': '2016-12-19 14:18:00' },
      { Project: 'ALG HUD', 'Date Started': '2016-12-18 14:18:00' },
    ];
    expect(sut(tickets)).to.eql({
      HUD: tickets.reverse(),
    });
  });
});

describe('converter.convert', () => {
  const sut = converter.convert;

  it('should put the correct red columns', () => {
    const typicalTicket = {
      Project: 'ALG Resources',
      'Issue Type': 'Sub-task',
      Key: 'ARES-483',
      Summary: 'Smart redirection mechanism in Resources',
      Priority: 'Medium',
      'Billing - Project': '',
      'Date Started': '2016-12-19 14:18:00',
      Username: 'john.doe',
      'Display Name': 'John Doe',
      'Time Spent (h)': '4',
      'Work Description': '',
    };
    expect(sut(typicalTicket)).to.eql({
      Date: '12-19-2016',
      'Task Code ID': '234',
      'Jira Number': 'ARES-483',
      'Task Description': 'Smart redirection mechanism in Resources',
      Hours: '4',
    });
  });
});

describe('converter.toRedProjectTypes', () => {
  const sut = converter.toRedProjectTypes;

  it('should not remap the special cases', () => {
    expect(sut({
      noProject: [],
      special: [],
    })).to.eql({
      noProject: [],
      special: [],
    });
  });

  it('should remap the blue types to red types', () => {
    expect(sut({
      ARES: [],
    })).to.eql({
      RSCR: [],
    });
  });
});
