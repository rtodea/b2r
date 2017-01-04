const R = require('ramda');
const constants = require('./constants');
const projectMappings = require('../db/blue-to-red-project.json');


function getProject(ticket, specialTickets = []) {
  if (specialTickets.includes(ticket[constants.blue.ID])) {
    return constants.converter.SPECIAL;
  }

  return R.prop(constants.blue.BILLING_PROJECT, ticket) ||
    R.prop(constants.blue.PROJECT, ticket) ||
    constants.converter.NO_PROJECT;
}


function split(tickets, options = {}) {
  if (R.isNil(tickets) || R.isEmpty(tickets)) {
    return {};
  }

  return R.groupBy((ticket) => (getProject(ticket, options.special)), tickets);
}


function convert(blueTicket) {
  const redTicket = {};

  const commonConstantNames = [
    'WHEN',
    'TIME_SPENT',
    'TITLE',
    'ID',
  ];
  const blueColumnNames = R.pick(commonConstantNames, constants.blue);
  const redColumnNames = constants.red;
  R.toPairs(blueColumnNames).forEach(([k, v]) => {
    redTicket[redColumnNames[k]] = blueTicket[v];
  });

  redTicket[redColumnNames.WHEN] = convertDateToRedFormat(redTicket[redColumnNames.WHEN]);
  redTicket[redColumnNames.TASK_CODE] = getRedTaskCode(blueTicket);
  return redTicket;
}


function convertDateToRedFormat(someDateString) {
  // e.g. 2016-12-19 14:18:00
  return someDateString.split(' ')[0];
}


function getRedTaskCode(blueTicket) {
  const blueProjectPrefix = blueTicket[constants.blue.ID].split('-')[0];
  const redProjectPrefix = projectMappings[blueProjectPrefix];

  return `${redProjectPrefix}-WEB`;
}


module.exports = {
  split,
  convert,
};
