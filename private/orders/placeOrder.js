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
                _context.next = 66;
                break;
              }

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
              matchingOutcome = type === "sell" ? outcome : outcome === 0 ? 1 : outcome === 1 ? 0 : false;

              if (!(matchingOutcome === false)) {
                _context.next = 7;
                break;
              }

              throw "unknown outcome";

            case 7:
              _context.next = 9;
              return Orders.find({
                pricePerShare: inversePrice,
                market: market._id,
                outcome: matchingOutcome,
                filled: 0,
                type: "buy"
              }, 'order _id signature pricePerShare shareAmountLeft outcome outcomeToken type');

            case 9:
              matchingBuyOrders = _context.sent;
              matchingSellOrders = [];

              if (!(type === "buy")) {
                _context.next = 15;
                break;
              }

              _context.next = 14;
              return Orders.find({
                pricePerShare: inversePrice,
                market: market._id,
                outcome: outcome,
                filled: 0,
                type: "sell"
              }, 'order _id signature pricePerShare shareAmountLeft outcome outcomeToken type');

            case 14:
              matchingSellOrders = _context.sent;

            case 15:
              matchingOrders = matchingSellOrders.concat(matchingBuyOrders);
              console.log(order, matchingOrders);

              if (!(matchingOrders.length > 0)) {
                _context.next = 62;
                break;
              }

              matchedOrder = matchingOrders[0];

              if (!(matchedOrder.type === "sell" || type === "sell")) {
                _context.next = 40;
                break;
              }

              _context.next = 22;
              return contractWrappers.exchange.matchOrdersAsync(_objectSpread({}, order, {
                signature: signature
              }), _objectSpread({}, matchedOrder.order, {
                signature: matchedOrder.signature
              }), _pvt.ADDRESS);

            case 22:
              tx = _context.sent;
              console.log("tx:", tx);
              _context.next = 26;
              return (0, _awaitTransactionMinedAsync.default)(tx);

            case 26:
              receipt = _context.sent;
              console.log("receipt:", receipt);

              if (!(receipt.status === "0x1" || receipt.status === true)) {
                _context.next = 37;
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

              _context.next = 32;
              return matchedOrder.save();

            case 32:
              _context.next = 34;
              return newOrderInstance.save();

            case 34:
              resolve({
                filled: "Transaction success"
              });
              _context.next = 38;
              break;

            case 37:
              resolve({
                error: "tx failed"
              });

            case 38:
              _context.next = 60;
              break;

            case 40:
              // If none of the orders are sell orders new shares have to be minted by sending the orders to the matching engine.
              // It's important that the indexes of the orders, wrapped tokens and the signatures match one another.
              // Also Broker contract expects the orders to be indexed by outcome in the order: No, Yes. So outcomes would be [0, 1].
              orderedBrokerData = (0, _orderUtils.getOrderedBrokerData)([newOrderInstance, matchedOrder]);
              orders = orderedBrokerData.orders, outcomeTokens = orderedBrokerData.outcomeTokens, signatures = orderedBrokerData.signatures;
              smallestOrder = (0, _orderUtils.getSmallestOrder)(newOrderInstance, matchedOrder);
              totalFillAmount = smallestOrder.shareAmountLeft * _constants.NUM_TICKS * smallestOrder.pricePerShare * (1 / smallestOrder.pricePerShare);
              _context.next = 46;
              return broker.buyShares(market._id, outcomeTokens, orders, signatures, totalFillAmount);

            case 46:
              res = _context.sent;
              _context.next = 49;
              return (0, _awaitTransactionMinedAsync.default)(res);

            case 49:
              _receipt = _context.sent;

              if (!(_receipt.status === true || _receipt.status === "0x1")) {
                _context.next = 59;
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

              _context.next = 54;
              return matchedOrder.save();

            case 54:
              _context.next = 56;
              return newOrderInstance.save();

            case 56:
              resolve({
                filled: "Transaction success"
              });
              _context.next = 60;
              break;

            case 59:
              resolve({
                error: "tx failed"
              });

            case 60:
              _context.next = 64;
              break;

            case 62:
              newOrderInstance.save(function (err) {
                if (err) throw err;
              });
              resolve({
                msg: "order added to orderbooks"
              });

            case 64:
              _context.next = 67;
              break;

            case 66:
              resolve({
                error: "no order provided"
              });

            case 67:
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