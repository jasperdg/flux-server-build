"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSmallestOrder = exports.getOrderedBrokerData = exports.isValidOutcome = void 0;

var isValidOutcome = function isValidOutcome(outcome) {
  return outcome === 1 || outcome === 0;
};

exports.isValidOutcome = isValidOutcome;

var getOrderedBrokerData = function getOrderedBrokerData(orders) {
  var orderedOutcomeTokens = {
    orders: [],
    outcomeTokens: [],
    signatures: []
  };

  for (var i = 0; i < orders.length; i++) {
    var order = orders[i];
    orderedOutcomeTokens.orders[order.outcome] = order.order;
    orderedOutcomeTokens.outcomeTokens[order.outcome] = order.outcomeToken;
    orderedOutcomeTokens.signatures[order.outcome] = order.signature;
  }

  return orderedOutcomeTokens;
};

exports.getOrderedBrokerData = getOrderedBrokerData;

var getSmallestOrder = function getSmallestOrder(a, b) {
  return a.shareAmountLeft === b.shareAmountLeft ? a : a.shareAmountLeft < b.shareAmountLeft ? a : b.shareAmountLeft < a.shareAmountLeft ? b : "false";
};

exports.getSmallestOrder = getSmallestOrder;