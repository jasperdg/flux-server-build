"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrderBookOrders = exports.getMarketOrder = exports.getOrders = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _order = _interopRequireDefault(require("../../mongoose/schemas/order"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Orders = _mongoose.default.model('orders', _order.default);

var getOrders = function getOrders(req) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(resolve, reject) {
      var orders;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return Orders.find(req.body.query);

            case 2:
              orders = _context.sent;
              resolve(orders);

            case 4:
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

exports.getOrders = getOrders;

var getMarketOrder = function getMarketOrder(req) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref2 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee2(resolve, reject) {
      var _req$body$query, type, outcome, oposingOutcome, marketOrder;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _req$body$query = req.body.query, type = _req$body$query.type, outcome = _req$body$query.outcome;
              oposingOutcome = outcome === 0 ? 1 : 0;

              if (type === 'buy') {
                marketOrder = Orders.findOne({
                  $or: [{
                    outcome: oposingOutcome,
                    type: 'buy',
                    filled: 0
                  }, {
                    outcome: outcome,
                    type: 'sell',
                    filled: 0
                  }]
                });
              } else {
                marketOrder = Orders.findOne({
                  outcome: outcome,
                  type: 'buy',
                  filled: 0
                });
              }

              _context2.next = 5;
              return marketOrder.sort("inversePrice").exec();

            case 5:
              resolve(marketOrder);

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3, _x4) {
      return _ref2.apply(this, arguments);
    };
  }());
};

exports.getMarketOrder = getMarketOrder;

var getOrderBookOrders = function getOrderBookOrders(req) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(resolve, reject) {
      var _req$body$query2, outcome, market, oposingOutcome, marketOrder;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _req$body$query2 = req.body.query, outcome = _req$body$query2.outcome, market = _req$body$query2.market;
              oposingOutcome = outcome === 0 ? 1 : 0;
              _context3.next = 4;
              return Orders.find({
                $or: [{
                  market: market,
                  outcome: outcome,
                  type: 'buy',
                  filled: 0
                }, {
                  market: market,
                  outcome: oposingOutcome,
                  type: 'sell',
                  filled: 0
                }]
              }).sort("inversePrice").exec();

            case 4:
              marketOrder = _context3.sent;
              resolve(marketOrder);

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x5, _x6) {
      return _ref3.apply(this, arguments);
    };
  }());
};

exports.getOrderBookOrders = getOrderBookOrders;