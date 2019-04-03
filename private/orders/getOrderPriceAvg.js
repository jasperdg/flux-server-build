"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _order = _interopRequireDefault(require("../../mongoose/schemas/order"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Orders = _mongoose.default.model('orders', _order.default);

var getOrderPriceAvg = function getOrderPriceAvg(req) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(resolve, reject) {
      var _req$body$query, start, end, market, orders, hourBeenAddedStorage, result, timesAddedInsteadOfPushed;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _req$body$query = req.body.query, start = _req$body$query.start, end = _req$body$query.end, market = _req$body$query.market;
              _context.next = 3;
              return Orders.aggregate([{
                "$match": {
                  "creationTime": {
                    $gt: start,
                    //beginning of the day,
                    $lt: end //end of the day

                  },
                  "market": market
                }
              }, {
                "$addFields": {
                  convertedtakerAssetAmount: {
                    $toDouble: "$order.takerAssetAmount"
                  }
                }
              }, {
                "$group": {
                  _id: {
                    outcome: "$outcome",
                    hour: {
                      $hour: {
                        "$add": [new Date(0), "$creationTime"]
                      }
                    }
                  },
                  avgShares: {
                    $avg: {
                      "$multiply": [{
                        "$divide": ["$convertedtakerAssetAmount", Math.pow(10, 14)]
                      }, "$pricePerShare"]
                    }
                  },
                  avgQty: {
                    $avg: {
                      "$divide": ["$convertedtakerAssetAmount", Math.pow(10, 14)]
                    }
                  },
                  count: {
                    $sum: 1
                  }
                }
              }, {
                "$sort": {
                  "_id.hour": 1
                }
              }]);

            case 3:
              orders = _context.sent;
              hourBeenAddedStorage = {};
              result = []; // Everytime a value gets added to a previous index that means forEach index is off by 1 incerement, this should be corrected for
              // In future additions

              timesAddedInsteadOfPushed = 0;
              orders.forEach(function (order, index) {
                var hour = order._id.hour + 2;
                var outcome = order._id.outcome;
                var exists = !!hourBeenAddedStorage[hour];

                if (!exists) {
                  result.push({
                    hour: hour,
                    outcome: order,
                    yesAvg: outcome === 1 ? order.avgShares / order.avgQty : 0,
                    noAvg: outcome === 0 ? order.avgShares / order.avgQty : 0,
                    avgQty: order.avgQty,
                    avgShares: order.avgShares,
                    totalOrders: order.count
                  });
                } else {
                  if (outcome === 1) {
                    result[hourBeenAddedStorage[hour].index - timesAddedInsteadOfPushed].yesAvg = order.avgShares / order.avgQty;
                  } else {
                    result[hourBeenAddedStorage[hour].index - timesAddedInsteadOfPushed].noAvg = order.avgShares / order.avgQty;
                  }

                  timesAddedInsteadOfPushed++;
                }

                hourBeenAddedStorage[hour] = {
                  index: index
                };
              });
              resolve(result);

            case 9:
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

var _default = getOrderPriceAvg;
exports.default = _default;