const R = require('ramda');
const constants = require('./constants');
const projectMappings = require('../db/blue-to-red-project.json');
const blueProjectPrefixes = require('../db/blue-project-name-to-prefix.json');


function getBlueProject(ticket, specialTickets = []) {
  if (specialTickets.includes(ticket[constants.blue.ID])) {
    return constants.converter.SPECIAL;
  }

  return getBlueProjectPrefix(ticket) || constants.converter.NO_PROJECT;
}


function getBlueProjectPrefix(ticket) {
  const projectName = R.prop(constants.blue.BILLING_PROJECT, ticket) ||
    R.prop(constants.blue.PROJECT, ticket);

  return blueProjectPrefixes[projectName];
}


function split(tickets, options = {}) {
  if (R.isNil(tickets) || R.isEmpty(tickets)) {
    return {};
  }

  return R.groupBy((ticket) => (getBlueProject(ticket, options.special)), tickets);
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
  // e.g. from 2016-12-19 14:18:00 to 12-19-2016
  const d = (new Date(someDateString));
  return `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
}


function getRedTaskCode(blueTicket) {
  const blueProjectPrefix = getBlueProjectPrefix(blueTicket);
  const redProjectPrefix = projectMappings[blueProjectPrefix];

  return `${redProjectPrefix}-WEB`;
}


function toRedProjectTypes(ticketsGroupedByBlueProjectTypes) {
  const specialGroups = [constants.converter.SPECIAL, constants.converter.NO_PROJECT];
  const newMapping = {};

  R.toPairs(ticketsGroupedByBlueProjectTypes).forEach(([k, v]) => {
    if (specialGroups.includes(k)) {
      newMapping[k] = v;
    } else {
      newMapping[projectMappings[k]] = v;
    }
  });

  return newMapping;
}


module.exports = {
  split,
  convert,
  toRedProjectTypes,
};
