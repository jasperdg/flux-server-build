"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _user = _interopRequireDefault(require("../../mongoose/schemas/user"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _pvt = require("./../../.pvt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* GET home page. */
var User = _mongoose.default.model('users', _user.default);

var auth = function auth(req) {
  var accessToken = req.body.accessToken;
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(resolve, reject) {
      var _ref2, isValid, matchingAccessToken, token, userInstance;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!accessToken) {
                _context.next = 21;
                break;
              }

              _context.next = 3;
              return _user.default.methods.isCorrectAccessToken(accessToken);

            case 3:
              _ref2 = _context.sent;
              isValid = _ref2.isValid;
              matchingAccessToken = _ref2.matchingAccessToken;
              console.log(isValid);

              if (!isValid) {
                _context.next = 18;
                break;
              }

              token = _jsonwebtoken.default.sign({}, _pvt.SECRET, {
                expiresIn: "12h"
              });
              _context.next = 11;
              return User.find({
                accessToken: matchingAccessToken
              });

            case 11:
              userInstance = _context.sent;
              userInstance[0].logins.push({
                date: new Date(),
                ip: ip
              });
              userInstance[0].save();
              console.log('doing this');
              resolve(token);
              _context.next = 19;
              break;

            case 18:
              resolve(false);

            case 19:
              _context.next = 22;
              break;

            case 21:
              resolve(false);

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

var _default = auth;
exports.default = _default;