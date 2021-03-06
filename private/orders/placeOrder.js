"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BrokerWrapper = _interopRequireDefault(require("../wrappers/BrokerWrapper"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _order = _interopRequireDefault(require("../../mongoose/schemas/order"));

var _web3Utils = require("web3-utils");

var _x3 = require("0x.js");

var _providerEngine = _interopRequireDefault(require("./../providerEngine"));

var _orderUtils = require("../utils/orderUtils.js");

var _constants = require("../../constants");

var _pvt = require("./../../.pvt");

var _awaitTransactionMinedAsync = _interopRequireDefault(require("../utils/awaitTransactionMinedAsync"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var broker = new _BrokerWrapper.default();
var fullSetPrice = (0, _web3Utils.toWei)('1', 'ether');
var contractWrappers = new _x3.ContractWrappers(_providerEngine.default, {
  networkId: _constants.RINKEBY_CONFIGS.networkId
});

var Orders = _mongoose.default.model('orders', _order.default);

var placeOrder = function placeOrder(req) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(resolve, reject) {
      var _req$body, order, signature, market, outcome, outcomeToken, type, pricePerShare, inversePrice, newOrderInstance, matchingOutcome, matchingBuyOrders, matchingSellOrders, matchingOrders, matchedOrder, tx, receipt, orderedBrokerData, orders, outcomeTokens, signatures, smallestOrder, totalFillAmount, res, _receipt;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _req$body = req.body, order = _req$body.order, signature = _req$body.signature, market = _req$body.market, outcome = _req$body.outcome, outcomeToken = _req$body.outcomeToken, type = _req$body.type;

              if (!(order && signature && market && (0, _orderUtils.isValidOutcome)(outcome))) {
                _context.next = 65;
                break;
              }

              // TODO: remove duplicate code
              if (type === "sell") {
                inversePrice = (order.makerAssetAmount / order.takerAssetAmount / _constants.NUM_TICKS).toFixed(2).toString();
                pricePerShare = (0, _web3Utils.fromWei)(fullSetPrice.toString(), "ether") - inversePrice;
              } else {
                pricePerShare = (order.makerAssetAmount / order.takerAssetAmount / _constants.NUM_TICKS).toFixed(2).toString();
                inversePrice = (0, _web3Utils.fromWei)(fullSetPrice.toString(), "ether") - pricePerShare;
              }

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
                type: type,
                creationTime: new Date().getTime()
              });
              _context.next = 6;
              return newOrderInstance.save();

            case 6:
              matchingOutcome = type === "sell" ? outcome : outcome === 0 ? 1 : outcome === 1 ? 0 : false;

              if (!(matchingOutcome === false)) {
                _context.next = 9;
                break;
              }

              throw "unknown outcome";

            case 9:
              _context.next = 11;
              return Orders.find({
                pricePerShare: inversePrice,
                market: market._id,
                outcome: matchingOutcome,
                filled: 0,
                type: "buy"
              }, 'order _id signature pricePerShare shareAmountLeft outcome outcomeToken type');

            case 11:
              matchingBuyOrders = _context.sent;
              matchingSellOrders = [];

              if (!(type === "buy")) {
                _context.next = 17;
                break;
              }

              _context.next = 16;
              return Orders.find({
                pricePerShare: inversePrice,
                market: market._id,
                outcome: outcome,
                filled: 0,
                type: "sell"
              }, 'order _id signature pricePerShare shareAmountLeft outcome outcomeToken type');

            case 16:
              matchingSellOrders = _context.sent;

            case 17:
              matchingOrders = matchingSellOrders.concat(matchingBuyOrders);

              if (!(matchingOrders.length > 0)) {
                _context.next = 61;
                break;
              }

              matchedOrder = matchingOrders[0];

              if (!(matchedOrder.type === "sell" || type === "sell")) {
                _context.next = 39;
                break;
              }

              _context.next = 23;
              return contractWrappers.exchange.matchOrdersAsync(_objectSpread({}, order, {
                signature: signature
              }), _objectSpread({}, matchedOrder.order, {
                signature: matchedOrder.signature
              }), _pvt.ADDRESS);

            case 23:
              tx = _context.sent;
              _context.next = 26;
              return (0, _awaitTransactionMinedAsync.default)(tx);

            case 26:
              receipt = _context.sent;

              if (!(receipt.status === "0x1" || receipt.status === true)) {
                _context.next = 36;
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

              _context.next = 31;
              return matchedOrder.save();

            case 31:
              _context.next = 33;
              return newOrderInstance.save();

            case 33:
              resolve({
                filled: "Transaction success"
              });
              _context.next = 37;
              break;

            case 36:
              resolve({
                error: "tx failed"
              });

            case 37:
              _context.next = 59;
              break;

            case 39:
              // If none of the orders are sell orders new shares have to be minted by sending the orders to the matching engine.
              // It's important that the indexes of the orders, wrapped tokens and the signatures match one another.
              // Also Broker contract expects the orders to be indexed by outcome in the order: No, Yes. So outcomes would be [0, 1].
              orderedBrokerData = (0, _orderUtils.getOrderedBrokerData)([newOrderInstance, matchedOrder]);
              orders = orderedBrokerData.orders, outcomeTokens = orderedBrokerData.outcomeTokens, signatures = orderedBrokerData.signatures;
              smallestOrder = (0, _orderUtils.getSmallestOrder)(newOrderInstance, matchedOrder);
              totalFillAmount = smallestOrder.shareAmountLeft * _constants.NUM_TICKS * smallestOrder.pricePerShare * (1 / smallestOrder.pricePerShare);
              _context.next = 45;
              return broker.buyShares(market._id, outcomeTokens, orders, signatures, totalFillAmount);

            case 45:
              res = _context.sent;
              _context.next = 48;
              return (0, _awaitTransactionMinedAsync.default)(res);

            case 48:
              _receipt = _context.sent;

              if (!(_receipt.status === true || _receipt.status === "0x1")) {
                _context.next = 58;
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

              _context.next = 53;
              return matchedOrder.save();

            case 53:
              _context.next = 55;
              return newOrderInstance.save();

            case 55:
              resolve({
                filled: "Transaction success"
              });
              _context.next = 59;
              break;

            case 58:
              resolve({
                error: "tx failed"
              });

            case 59:
              _context.next = 63;
              break;

            case 61:
              newOrderInstance.save(function (err) {
                if (err) throw err;
              });
              resolve({
                msg: "order added to orderbooks"
              });

            case 63:
              _context.next = 66;
              break;

            case 65:
              resolve({
                error: "no order provided"
              });

            case 66:
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