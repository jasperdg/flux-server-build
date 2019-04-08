"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _user = _interopRequireDefault(require("../../mongoose/schemas/user"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var User = _mongoose.default.model('users', _user.default);

var saltRounds = 10;
/* GET home page. */

var addUser = function addUser() {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(resolve, reject) {
      var users;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              users = [{
                accessToken: "U4XmYdXHNkRROdSJGyPq",
                name: "Jascha Samadi"
              }, {
                accessToken: "cNOmF0ywaFgVx1tNe00V",
                name: "ScalarVC"
              }, {
                accessToken: "7h7G9hCxW6v8xpARE0oy",
                name: "MultiCoinCap"
              }, {
                accessToken: "rY4kqCXW15VWlLnJGn61",
                name: "Fabric VC"
              }, {
                accessToken: "Uac5y79XRmkVRfjqCs8I",
                name: "Cherry VC"
              }, {
                accessToken: "byhiJizHXIQYgOY79V3i",
                name: "HTGF"
              }, {
                accessToken: "rrZfjbbiikHWgYVVaRxf",
                name: "GFC"
              }, {
                accessToken: "CCfO9FmqRWt0IHKycnGv",
                name: "Coparion"
              }, {
                accessToken: "k2HwM9IjbFwZmsnbwnfz",
                name: "Gnosis"
              }, {
                accessToken: "BQBBdF3THE0FWQ8LUXzl",
                name: "holtzbrink"
              }, {
                accessToken: "Fxm9rn4Q5tj1jzwABo4g",
                name: "Leon Wankum"
              }, {
                accessToken: "cafhiojdYqgh1C42RFxK",
                name: "EarlyBlock"
              }, {
                accessToken: "jbHlYwukVWjlxPWAIUo0",
                name: "Point Nine"
              }, {
                accessToken: "EEqhM8aXRo06YCo3OhaP",
                name: "Red Alpine"
              }];
              users.forEach(function (d) {
                _bcrypt.default.hash(d.accessToken, saltRounds, function (err, hashedAccessToken) {
                  if (err) {
                    console.log(err);
                  } else {
                    var userInstance = new User({
                      name: d.name,
                      accessToken: hashedAccessToken
                    });
                    userInstance.save();
                  }
                });
              });
              resolve(true);

            case 3:
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

var _default = addUser;
exports.default = _default;