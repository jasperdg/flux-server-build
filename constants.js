"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BLACKLIST = exports.RINKEBY_CONTRACTS = exports.NODES = exports.BASE_DERIVATION_PATH = exports.RINKEBY_CONFIGS = exports.MARKET = exports.NUM_TICKS = exports.WRAPPED_NO_TOKEN = exports.WRAPPED_YES_TOKEN = exports.PROXY_ADDRESS_RINKEBY = exports.FETH_ADDRESS_RINKEBY = exports.BROKER_ADDRESS_RINKEBY = exports.PROXY_ADDRESS_ROPSTEN = exports.FETH_ADDRESS_ROPSTEN = exports.BROKER_ADDRESS_ROPSTEN = exports.ZERO = exports.NULL_ADDRESS = void 0;

var _web3Utils = require("web3-utils");

// Config
var NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
exports.NULL_ADDRESS = NULL_ADDRESS;
var ZERO = (0, _web3Utils.toBN)(0); // Ropsten

exports.ZERO = ZERO;
var BROKER_ADDRESS_ROPSTEN = "0xA17dD610B69E7cfDc487730c3b2944a4062113bD";
exports.BROKER_ADDRESS_ROPSTEN = BROKER_ADDRESS_ROPSTEN;
var FETH_ADDRESS_ROPSTEN = "0x19a9fcDf24E8d73eEf7CABD06c67D167E3CbF28c";
exports.FETH_ADDRESS_ROPSTEN = FETH_ADDRESS_ROPSTEN;
var PROXY_ADDRESS_ROPSTEN = "0xb1408f4c245a23c31b98d2c626777d4c0d766caa"; // Rinkeby

exports.PROXY_ADDRESS_ROPSTEN = PROXY_ADDRESS_ROPSTEN;
var BROKER_ADDRESS_RINKEBY = "0x3fCE243e581Ff88814335888341Fb379Fd7EB74d";
exports.BROKER_ADDRESS_RINKEBY = BROKER_ADDRESS_RINKEBY;
var FETH_ADDRESS_RINKEBY = "0x6EdE4b72093bc12EdB94B84e79ecc8E9D147CF0c";
exports.FETH_ADDRESS_RINKEBY = FETH_ADDRESS_RINKEBY;
var PROXY_ADDRESS_RINKEBY = "0x2f5ae4f6106e89b4147651688a92256885c5f410";
exports.PROXY_ADDRESS_RINKEBY = PROXY_ADDRESS_RINKEBY;
var WRAPPED_YES_TOKEN = "0xB170a4DB166c486F42074DA20E79CB9D90dfDbEF";
exports.WRAPPED_YES_TOKEN = WRAPPED_YES_TOKEN;
var WRAPPED_NO_TOKEN = "0x388A083637cA340c6d0782D6873fe2D72e4951Db";
exports.WRAPPED_NO_TOKEN = WRAPPED_NO_TOKEN;
var NUM_TICKS = 10000;
exports.NUM_TICKS = NUM_TICKS;
var MARKET = "0x42db58a60d582aa881fe0c36f50919a1e927adc6";
exports.MARKET = MARKET;
var RINKEBY_CONFIGS = {
  rpcUrl: 'https://rinkeby.infura.io/',
  networkId: 4
};
exports.RINKEBY_CONFIGS = RINKEBY_CONFIGS;
var BASE_DERIVATION_PATH = "44'/60'/0'/0";
exports.BASE_DERIVATION_PATH = BASE_DERIVATION_PATH;
var NODES = {
  HTTP_ETH_RINKEBY: "https://rinkeby.infura.io/v3/d214fd459ac8445888a3ab273f6b5d10",
  WSS_ETH_RINKEBY: "wss://rinkeby.infura.io/v3/d214fd459ac8445888a3ab273f6b5d10",
  LOCAL_AUGUR: "ws://127.0.0.1:9001"
};
exports.NODES = NODES;
var RINKEBY_CONTRACTS = {
  WRAPPED_YES_TOKEN: "0xB170a4DB166c486F42074DA20E79CB9D90dfDbEF",
  WRAPPED_NO_TOKEN: "0x388A083637cA340c6d0782D6873fe2D72e4951Db"
};
exports.RINKEBY_CONTRACTS = RINKEBY_CONTRACTS;
var BLACKLIST = ["0x66e87b7f871c901e664411fe661c4f6a5a273f01"];
exports.BLACKLIST = BLACKLIST;