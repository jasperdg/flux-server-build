"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _augur = _interopRequireDefault(require("augur.js"));

var _constants = require("../../constants.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var augur = new _augur.default();

var AugurWrapper =
/*#__PURE__*/
function () {
  function AugurWrapper() {
    _classCallCheck(this, AugurWrapper);
  }

  _createClass(AugurWrapper, [{
    key: "init",
    // Connect to nodes.
    value: function init() {
      var ethereumNode = {
        httpAddresses: [_constants.NODES.HTTP_ETH_RINKEBY],
        wsAddresses: [_constants.NODES.WSS_ETH_RINKEBY]
      };
      var augurNode = _constants.NODES.LOCAL_AUGUR;
      return new Promise(
      /*#__PURE__*/
      function () {
        var _ref = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(resolve, reject) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  augur.connect({
                    ethereumNode: ethereumNode,
                    augurNode: augurNode
                  }, function (err, connectionInfo) {
                    if (err) reject(err);
                    resolve({
                      augur: augur,
                      connectionInfo: connectionInfo
                    });
                  });

                case 1:
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
    } // Get markets that are created by owner (flux)

  }, {
    key: "getMarketsByOwner",
    value: function getMarketsByOwner(p) {
      return new Promise(function (resolve, reject) {
        augur.markets.getMarkets(_objectSpread({}, p), function (err, res) {
          if (err) reject(err);
          resolve(res);
        });
      });
    }
  }, {
    key: "getMarketsInfo",
    value: function getMarketsInfo(p) {
      return new Promise(function (resolve, reject) {
        augur.markets.getMarketsInfo({
          marketIds: p
        }, function (err, res) {
          if (err) reject(err);
          resolve(res);
        });
      });
    } // Create a new market

  }, {
    key: "createMarket",
    value: function createMarket(p) {
      return new Promise(
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee2(resolve, reject) {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  augur.createMarket.createYesNoMarket(_objectSpread({}, p, {
                    onSent: function onSent(result) {
                      console.log("sent");
                      resolve(result);
                    },
                    onSuccess: function onSuccess(result) {
                      console.log("success", result);
                    },
                    onFailed: function onFailed(result) {
                      console.log("failed");
                      reject(result);
                    }
                  }));

                case 1:
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
    }
  }, {
    key: "getShareToken",
    // Get a market's share token
    value: function getShareToken(p) {
      return new Promise(function (resolve, reject) {
        augur.api.Market.getShareToken(p, function (err, res) {
          if (err) reject(err);
          resolve(res);
        });
      });
    } // Get a users position(s) in market

  }, {
    key: "getPositionInMarket",
    value: function getPositionInMarket(p) {
      return new Promise(function (resolve, reject) {
        augur.trading.getPositionInMarket(p, function (err, res) {
          if (err) reject(err);
          resolve(res);
        });
      });
    } // Purchase a complete set of a market's token

  }, {
    key: "buyCompleteSet",
    value: function buyCompleteSet(p) {
      return new Promise(function (resolve, reject) {
        augur.api.CompleteSets.publicBuyCompleteSets(_objectSpread({}, p, {
          onSent: function onSent(result) {
            console.log("sent");
            resolve(result);
          },
          onSuccess: function onSuccess(result) {
            console.log("success", result);
          },
          onFailed: function onFailed(result) {
            console.log("failed");
            reject(result);
          }
        }));
      });
    }
  }]);

  return AugurWrapper;
}();

var _default = AugurWrapper;
exports.default = _default;