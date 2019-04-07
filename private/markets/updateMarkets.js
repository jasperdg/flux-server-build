"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _AugurWrapper = _interopRequireDefault(require("../wrappers/AugurWrapper"));

var _pvt = require("../../.pvt.js");

var _getMarketOutcomes = _interopRequireDefault(require("../utils/getMarketOutcomes"));

var _formatMarket = _interopRequireDefault(require("../utils/formatMarket"));

var _market = _interopRequireDefault(require("../../mongoose/schemas/market"));

var _constants = require("../../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Markets = _mongoose.default.model('markets', _market.default);

var augur = new _AugurWrapper.default();
/* GET home page. */

var updateMarkets = function updateMarkets(req) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(resolve, reject) {
      var _ref2, connectionInfo, universe, getMarketsPayload, err, markets, marketDetails, marketPromises;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return augur.init();

            case 2:
              _ref2 = _context2.sent;
              connectionInfo = _ref2.connectionInfo;
              universe = connectionInfo.ethereumNode.contracts.Universe;
              getMarketsPayload = {
                universe: universe,
                creator: _pvt.MARKET_CREATOR
              };
              _context2.next = 8;
              return augur.getMarketsByOwner(getMarketsPayload);

            case 8:
              markets = _context2.sent;
              if (err) reject(err);
              _context2.next = 12;
              return augur.getMarketsInfo(markets);

            case 12:
              marketDetails = _context2.sent;
              if (err) reject(err);
              marketPromises = marketDetails.map(function (market) {
                return new Promise(
                /*#__PURE__*/
                function () {
                  var _ref3 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee(resolve, reject) {
                    var marketExists, outcomeTokens, formattedMarket, marketInstance;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (!(_constants.BLACKLIST.indexOf(market.id) == -1)) {
                              _context.next = 19;
                              break;
                            }

                            _context.next = 3;
                            return Markets.find({
                              _id: market.id
                            }, '_id');

                          case 3:
                            marketExists = _context.sent;

                            if (!(marketExists.length == 0)) {
                              _context.next = 16;
                              break;
                            }

                            _context.next = 7;
                            return (0, _getMarketOutcomes.default)(augur, market);

                          case 7:
                            outcomeTokens = _context.sent;
                            formattedMarket = (0, _formatMarket.default)(market, outcomeTokens);
                            marketInstance = new Markets(formattedMarket);
                            _context.next = 12;
                            return marketInstance.save();

                          case 12:
                            console.log("marketInstanceSAved");
                            resolve(true);
                            _context.next = 17;
                            break;

                          case 16:
                            resolve();

                          case 17:
                            _context.next = 20;
                            break;

                          case 19:
                            resolve();

                          case 20:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x3, _x4) {
                    return _ref3.apply(this, arguments);
                  };
                }());
              });
              _context2.next = 17;
              return Promise.all(marketPromises);

            case 17:
              resolve(true);

            case 18:
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

var _default = updateMarkets;
exports.default = _default;