"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _x = require("0x.js");

var _constants = require("../constants");

var _pvt = require("./../.pvt");

var _subproviders = require("@0x/subproviders");

var mnemonicWallet = new _subproviders.MnemonicWalletSubprovider({
  mnemonic: _pvt.MNEMONIC,
  baseDerivationPath: _constants.BASE_DERIVATION_PATH
});
var pe = new _x.Web3ProviderEngine();
pe.addProvider(mnemonicWallet);
pe.addProvider(new _x.RPCSubprovider(_constants.RINKEBY_CONFIGS.rpcUrl));
pe.start();
var _default = pe;
exports.default = _default;