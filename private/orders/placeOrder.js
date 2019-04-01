"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BrokerWrapper = _interopRequireDefault(require("../wrappers/BrokerWrapper"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _order = _interopRequireDefault(require("../../mongoose/schemas/order"));

var _web3Utils = require("web3-utils");

var _orderUtils = require("../utils/orderUtils.js");

var _constants = require("../../constants");

var _awaitTransactionMinedAsync = _interopRequireDefault(require("../utils/awaitTransactionMinedAsync"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var broker = new _BrokerWrapper.default();
var fullSetPrice = (0, _web3Utils.toWei)('1', 'ether');

var Orders = _mongoose.default.model('orders', _order.default);

var placeOrder = function placeOrder(req) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(resolve, reject) {
      var _req$body, order, signature, market, outcome, outcomeToken, pricePerShare, inversePrice, newOrderInstance, oposingOutcome, matchingOrders, matchedOrder, orderedBrokerData, orders, outcomeTokens, signatures, smallestOrder, totalFillAmount, res, receipt;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _req$body = req.body, order = _req$body.order, signature = _req$body.signature, market = _req$body.market, outcome = _req$body.outcome, outcomeToken = _req$body.outcomeToken;

              if (!(order && signature && market && (0, _orderUtils.isValidOutcome)(outcome))) {
                _context.next = 39;
                break;
              }

              pricePerShare = (order.makerAssetAmount / order.takerAssetAmount / _constants.NUM_TICKS).toFixed(2).toString();
              inversePrice = (0, _web3Utils.fromWei)(fullSetPrice.toString(), "ether") - pricePerShare;
              newOrderInstance = new Orders({
                order: order,
                signature: signature,
                market: market,
                outcome: outcome,
                amount: order.makerAssetAmount,
                shareAmountLeft: order.takerAssetAmount,
                pricePerShare: pricePerShare,
                outcomeToken: outcomeToken,
                inversePrice: inversePrice,
                filled: 0,
                creationTime: new Date().getTime()
              });
              oposingOutcome = outcome === 0 ? 1 : outcome === 1 ? 0 : false;

              if (!(oposingOutcome === false)) {
                _context.next = 8;
                break;
              }

              throw "unknown outcome";

            case 8:
              _context.next = 10;
              return Orders.find({
                pricePerShare: inversePrice,
                market: market._id,
                outcome: oposingOutcome,
                filled: 0
              }, 'order _id signature pricePerShare shareAmountLeft outcome outcomeToken');

            case 10:
              matchingOrders = _context.sent;

              if (!(matchingOrders.length > 0)) {
                _context.next = 35;
                break;
              }

              matchedOrder = matchingOrders[0]; // It's important that the indexes of the orders, wrapped tokens and the signatures match one another.
              // Also Broker contract expects the orders to be indexed by outcome in the order: No, Yes. So outcomes would be [0, 1].

              orderedBrokerData = (0, _orderUtils.getOrderedBrokerData)([newOrderInstance, matchedOrder]);
              orders = orderedBrokerData.orders, outcomeTokens = orderedBrokerData.outcomeTokens, signatures = orderedBrokerData.signatures;
              smallestOrder = (0, _orderUtils.getSmallestOrder)(newOrderInstance, matchedOrder);
              totalFillAmount = smallestOrder.shareAmountLeft * _constants.NUM_TICKS * smallestOrder.pricePerShare * (1 / smallestOrder.pricePerShare);
              _context.next = 19;
              return broker.buyShares(market._id, outcomeTokens, orders, signatures, totalFillAmount);

            case 19:
              res = _context.sent;
              _context.next = 22;
              return (0, _awaitTransactionMinedAsync.default)(res);

            case 22:
              receipt = _context.sent;

              if (!(receipt.status === "0x1")) {
                _context.next = 32;
                break;
              }

              if (newOrderInstance.shareAmountLeft === matchedOrder.shareAmountLeft) {
                matchedOrder.filled = 1;
                newOrderInstance.filled = 1;
              } else if (newOrderInstance.shareAmountLeft > matchedOrder.shareAmountLeft) {
                newOrderInstance.shareAmountLeft = newOrderInstance.shareAmountLeft - matchedOrder.shareAmountLeft;
                matchedOrder.filled = 1;
                matchedOrder.shareAmountLeft = 0;
              } else {
                newOrderInstance.filled = 1;
                matchedOrder.shareAmountLeft = matchedOrder.shareAmountLeft - newOrderInstance.shareAmountLeft;
                newOrderInstance.shareAmountLeft = 0;
              }

              _context.next = 27;
              return matchedOrder.save();

            case 27:
              _context.next = 29;
              return newOrderInstance.save();

            case 29:
              resolve({
                filled: "Transaction success"
              });
              _context.next = 33;
              break;

            case 32:
              resolve({
                error: "tx failed"
              });

            case 33:
              _context.next = 37;
              break;

            case 35:
              newOrderInstance.save(function (err) {
                if (err) throw err;
              });
              resolve({
                msg: "order added to orderbooks"
              });

            case 37:
              _context.next = 40;
              break;

            case 39:
              resolve({
                error: "no order provided"
              });

            case 40:
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

var _default = placeOrder;
exports.default = _default;