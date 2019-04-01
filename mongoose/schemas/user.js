"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var saltRounds = 10;
var userSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true,
    unique: true
  },
  logins: [{
    date: String,
    ip: String
  }]
});

var Users = _mongoose.default.model('users', userSchema);

userSchema.methods.isCorrectAccessToken = function (givenAccessToken) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(resolve, reject) {
      var users, isValid, matchingAccessToken;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return Users.find({}, 'accessToken');

            case 2:
              users = _context2.sent;
              isValid = false;
              matchingAccessToken = null;
              _context2.next = 7;
              return Promise.all(users.map(
              /*#__PURE__*/
              function () {
                var _ref3 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee(_ref2) {
                  var accessToken, equal;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          accessToken = _ref2.accessToken;
                          _context.next = 3;
                          return _bcrypt.default.compare(givenAccessToken, accessToken);

                        case 3:
                          equal = _context.sent;

                          if (equal) {
                            isValid = true;
                            matchingAccessToken = accessToken;
                          }

                        case 5:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x3) {
                  return _ref3.apply(this, arguments);
                };
              }()));

            case 7:
              resolve({
                isValid: isValid,
                matchingAccessToken: matchingAccessToken
              });

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

userSchema.pre('save', function (next) {
  if (this.isNew || this.isModified('accessToken')) {
    var doc = this;

    _bcrypt.default.hash(doc.accessToken, saltRounds, function (err, hashedAccessToken) {
      if (err) {
        next(err);
      } else {
        doc.accessToken = hashedAccessToken;
        next();
      }
    });
  } else {
    next();
  }
});
var _default = userSchema;
exports.default = _default;