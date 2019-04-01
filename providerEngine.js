"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.providerEngine = exports.pe = exports.mnemonicWallet = void 0;

var _x = require("0x.js");

var _subproviders = require("@0x/subproviders");

var _pvt = require("./.pvt");

var mnemonicWallet = new _subproviders.MnemonicWalletSubprovider({
  mnemonic: _pvt.MNEMONIC,
  baseDerivationPath: "44'/60'/0'/0"
});
exports.mnemonicWallet = mnemonicWallet;
var pe = new _x.Web3ProviderEngine();
exports.pe = pe;
pe.addProvider(mnemonicWallet);
pe.addProvider(new _x.RPCSubprovider('https://rinkeby.infura.io/'));
pe.start();
var providerEngine = pe;
exports.providerEngine = providerEngine;