"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _order = _interopRequireDefault(require("../../mongoose/schemas/order"));

var _x3 = require("0x.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Orders = _mongoose.default.model('orders', _order.default);

var getOpenSharesInOrders = function getOpenSharesInOrders(req) {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(resolve, reject) {
      var _req$body$query, userAddress, shareAddress, shareAssetData, makerAddress, openOrders;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _req$body$query = req.body.query, userAddress = _req$body$query.userAddress, shareAddress = _req$body$query.shareAddress;
              shareAssetData = _x3.assetDataUtils.encodeERC20AssetData(shareAddress);
              makerAddress = userAddress.toLowerCase();
              _context.next = 5;
              return Orders.aggregate([{
                $match: {
                  "order.makerAssetData": shareAssetData,
                  "filled": 0,
                  "order.makerAddress": makerAddress
                }
              }, {
                "$addFields": {
                  convertedMakerAssetAmount: {
                    $toDouble: "$order.takerAssetAmount"
                  }
                }
              }, {
                $group: {
                  _id: {
                    "userAddress": makerAddress
                  },
                  count: {
                    $sum: "$convertedMakerAssetAmount"
                  }
                }
              }]);

            case 5:
              openOrders = _context.sent;

              if (openOrders.length === 0) {
                resolve([{
                  count: 0
                }]);
              } else {
                resolve(openOrders);
              }

            case 7:
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

var _default = getOpenSharesInOrders;
exports.default = _default;