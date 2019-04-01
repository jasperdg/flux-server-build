"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Broker = require("./../abis/Broker");

var _constants = require("./../../constants");

var _pvt = require("./../../.pvt");

var _ethereumjsTx = _interopRequireDefault(require("ethereumjs-tx"));

var _web = _interopRequireDefault(require("web3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var privateKey = new Buffer.from(_pvt.PVT_KEY, 'hex');
var web3 = new _web.default("https://rinkeby.infura.io/991d53babdd44abea2329bb8db54a425");
var contract = new web3.eth.Contract(_Broker.abi, _constants.BROKER_ADDRESS_RINKEBY);

var BrokerWrapper =
/*#__PURE__*/
function () {
  function BrokerWrapper() {
    _classCallCheck(this, BrokerWrapper);
  }

  _createClass(BrokerWrapper, [{
    key: "getWASAddress",
    value: function getWASAddress() {
      return new Promise(function (resolve, reject) {
        contract.methods.getWrappedShareAddress().call({
          from: web3.account
        }, function (err, res) {
          if (err) reject(err);
          resolve(res);
        });
      });
    }
  }, {
    key: "buyShares",
    value: function () {
      var _buyShares = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(market, wrappedTokens, orders, signatures, totalFillAmount) {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", new Promise(
                /*#__PURE__*/
                function () {
                  var _ref = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee(resolve, reject) {
                    var utils, data, nonce, gasPrice, gasPriceHex, gasLimitHex, amountHex, rawTx, tx, serializedTx;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            utils = web3.utils;
                            data = contract.methods.fillAugurOrders(market, wrappedTokens, orders, signatures).encodeABI();
                            _context.next = 4;
                            return web3.eth.getTransactionCount(_pvt.ADDRESS);

                          case 4:
                            nonce = _context.sent;
                            _context.next = 7;
                            return utils.toWei("1", "gwei");

                          case 7:
                            gasPrice = _context.sent;
                            gasPriceHex = utils.toHex(gasPrice);
                            gasLimitHex = utils.toHex(3000000);
                            amountHex = utils.toHex(totalFillAmount);
                            rawTx = {
                              nonce: nonce,
                              gasPrice: gasPriceHex,
                              gasLimit: gasLimitHex,
                              to: _constants.BROKER_ADDRESS_RINKEBY,
                              value: amountHex,
                              data: data
                            };
                            tx = new _ethereumjsTx.default(rawTx);
                            tx.sign(privateKey);
                            serializedTx = tx.serialize();
                            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('transactionHash', resolve).on('receipt', console.log).on('error', reject);

                          case 16:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x6, _x7) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function buyShares(_x, _x2, _x3, _x4, _x5) {
        return _buyShares.apply(this, arguments);
      }

      return buyShares;
    }()
  }]);

  return BrokerWrapper;
}();

exports.default = BrokerWrapper;