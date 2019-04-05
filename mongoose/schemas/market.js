"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//Require Mongoose
var mongoose = require('mongoose'); //Define a schema


var Schema = mongoose.Schema;
var marketSchema = new Schema({
  info: {
    description: String,
    category: String,
    endTime: Number,
    // TODO: Make this the formatted date
    extraInfo: String,
    subCategory: {
      type: String,
      ref: "companies"
    }
  },
  _id: String,
  volume: Number,
  yesToken: String,
  brokerAddress: String,
  noToken: String,
  wrappedYesToken: String,
  wrappedNoToken: String
});
var _default = marketSchema;
exports.default = _default;