"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//Require Mongoose
var mongoose = require('mongoose'); //Define a schema


var Schema = mongoose.Schema;
var categorySchema = new Schema({
  metadata: {
    volume: Number,
    numberOfMarkets: Number // TODO: Make this the formatted date

  },
  iconImg: String,
  bannerImg: String,
  name: String,
  description: String
});
var _default = categorySchema;
exports.default = _default;