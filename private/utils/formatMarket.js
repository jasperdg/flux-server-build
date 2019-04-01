"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var formatMarket = function formatMarket(market, outcomeTokens) {
  return {
    info: {
      description: market.description,
      endTime: market.endTime,
      category: market.category,
      extraInfo: null
    },
    _id: market.id,
    volume: market.openInterest,
    noToken: outcomeTokens[0],
    yesToken: outcomeTokens[1],
    wrappedYesToken: null,
    wrappedNoToken: null
  };
};

var _default = formatMarket;
exports.default = _default;