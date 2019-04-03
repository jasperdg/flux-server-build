"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//Require Mongoose
var mongoose = require('mongoose'); //Define a schema


var Schema = mongoose.Schema;
var orderSchema = new Schema({
  order: {
    senderAddress: String,
    makerAddress: String,
    takerAddress: String,
    makerFee: String,
    takerFee: String,
    makerAssetAmount: String,
    takerAssetAmount: String,
    makerAssetData: String,
    takerAssetData: String,
    salt: String,
    exchangeAddress: String,
    feeRecipientAddress: String,
    expirationTimeSeconds: String
  },
  creationTime: Number,
  market: {
    type: String,
    ref: 'markets'
  },
  type: String,
  outcome: Number,
  outcomeToken: String,
  matchingOutcome: Number,
  signature: String,
  pricePerShare: Number,
  inversePrice: Number,
  amount: Number,
  shareAmountLeft: Number,
  filled: Number
});
var _default = orderSchema;
exports.default = _default;