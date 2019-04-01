"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var getMarketOutcomes =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(augur, market) {
    var outcomeTokenPromises;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            outcomeTokenPromises = [];
            market.outcomes.forEach(function (outcome) {
              var payload = {
                _outcome: outcome.id,
                tx: {
                  to: market._id
                }
              };
              var outcomeTokenPromise = augur.getShareToken(payload);
              outcomeTokenPromises.push(outcomeTokenPromise);
            });
            return _context.abrupt("return", Promise.all(outcomeTokenPromises));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getMarketOutcomes(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = getMarketOutcomes;
exports.default = _default;