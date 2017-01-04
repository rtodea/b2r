const R = require('ramda');
const constants = require('./constants');


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


function convert() {
  // TODO: implement this
}


module.exports = {
  split,
  convert,
};
