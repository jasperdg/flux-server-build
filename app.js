"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _morgan = _interopRequireDefault(require("morgan"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _index = _interopRequireDefault(require("./routes/index"));

var _orderRoutes = _interopRequireDefault(require("./routes/orderRoutes/"));

var _marketRoutes = _interopRequireDefault(require("./routes/marketRoutes/"));

var _categoryRoutes = _interopRequireDefault(require("./routes/categoryRoutes/"));

var _userRoutes = _interopRequireDefault(require("./routes/userRoutes/"));

var _companyRoutes = _interopRequireDefault(require("./routes/companyRoutes/"));

var _middleware = _interopRequireDefault(require("./private/middleware/middleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoDB = 'mongodb://localhost/FLUX';

_mongoose.default.connect(mongoDB, {
  useNewUrlParser: true
});

_mongoose.default.Promise = global.Promise;
var db = _mongoose.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
var app = (0, _express.default)();
app.use((0, _morgan.default)('dev'));
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
}));
app.use((0, _cookieParser.default)());
app.use(_express.default.static(_path.default.join(__dirname, 'public')));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
});
app.use('/', _index.default);
app.use('/orders', _middleware.default, _orderRoutes.default);
app.use('/markets', _marketRoutes.default);
app.use('/categories', _middleware.default, _categoryRoutes.default);
app.use('/companies', _middleware.default, _companyRoutes.default);
app.use('/user', _userRoutes.default);
module.exports = app;