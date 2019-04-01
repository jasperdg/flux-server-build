"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _market = _interopRequireDefault(require("../../mongoose/schemas/market"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Markets = _mongoose.default.model('markets', _market.default);
/* GET home page. */


var updateMarket = function updateMarket(req) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(resolve, reject) {
      var res, market;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return Markets.find({
                _id: req.body.marketId
              });

            case 2:
              res = _context.sent;
              market = res[0];

              if (!(market.wrappedYesToken === null && market.wrappedNoToken === null)) {
                _context.next = 12;
                break;
              }

              market.wrappedNoToken = req.body.wrappedNoToken;
              market.wrappedYesToken = req.body.wrappedYesToken;
              _context.next = 9;
              return market.save();

            case 9:
              resolve(market._id, "updated");
              _context.next = 13;
              break;

            case 12:
              reject("wrapped tokens are already set");

            case 13:
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

var _default = updateMarket;
exports.default = _default;