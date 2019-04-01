"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _pvt = require("./../../.pvt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var withAuth = function withAuth(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    _jsonwebtoken.default.verify(token, _pvt.SECRET, function (err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        next();
      }
    });
  }
};

var _default = withAuth;
exports.default = _default;