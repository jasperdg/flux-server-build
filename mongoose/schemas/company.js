"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//Require Mongoose
var mongoose = require('mongoose'); //Define a schema


var Schema = mongoose.Schema;
var companySchema = new Schema({
  iconImg: String,
  name: String,
  description: String
});
var _default = companySchema;
exports.default = _default;