'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _check = require('express-validator/check');

var _ApiError = require('../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _ApiResponse = require('../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

var _priceOfKm = require('../models/price-of-km.model');

var _priceOfKm2 = _interopRequireDefault(_priceOfKm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//KfQnPp9bNf2S2m6z
exports.default = {
    //create new order 
    allUsers: function allUsers(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var query, users;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            if (!(req.user.type != "ADMIN")) {
                                _context.next = 3;
                                break;
                            }

                            return _context.abrupt('return', next(new _ApiError2.default(403, "not admin user")));

                        case 3:
                            query = {};

                            if (req.query.type) {
                                query.type = req.query.type;
                            }
                            _context.next = 7;
                            return _user2.default.find(query).sort({ creationDate: -1 });

                        case 7:
                            users = _context.sent;
                            return _context.abrupt('return', res.status(200).json(users));

                        case 11:
                            _context.prev = 11;
                            _context.t0 = _context['catch'](0);

                            next(_context.t0);

                        case 14:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[0, 11]]);
        }))();
    },

    //create price for km in diliver
    createPriceOfKilloMeter: function createPriceOfKilloMeter(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var prices, newDoc;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.prev = 0;

                            if (req.user.type == "ADMIN") {
                                _context2.next = 3;
                                break;
                            }

                            return _context2.abrupt('return', next(new _ApiError2.default(403, "not admin user")));

                        case 3:
                            if (req.body.price) {
                                _context2.next = 5;
                                break;
                            }

                            return _context2.abrupt('return', next(new _ApiError2.default(422, "price is required")));

                        case 5:
                            _context2.next = 7;
                            return _priceOfKm2.default.find();

                        case 7:
                            prices = _context2.sent;

                            if (!(prices.length > 0)) {
                                _context2.next = 10;
                                break;
                            }

                            return _context2.abrupt('return', next(new _ApiError2.default(400, "price already exist, update it plz")));

                        case 10:
                            _context2.next = 12;
                            return _priceOfKm2.default.create(req.body);

                        case 12:
                            newDoc = _context2.sent;
                            return _context2.abrupt('return', res.status(201).json(newDoc));

                        case 16:
                            _context2.prev = 16;
                            _context2.t0 = _context2['catch'](0);

                            next(_context2.t0);

                        case 19:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[0, 16]]);
        }))();
    },


    //update price for km in diliver
    updatePriceOfKilloMeter: function updatePriceOfKilloMeter(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var price;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.prev = 0;

                            if (req.user.type == "ADMIN") {
                                _context3.next = 3;
                                break;
                            }

                            return _context3.abrupt('return', next(new _ApiError2.default(403, "not admin user")));

                        case 3:
                            if (req.body.price) {
                                _context3.next = 5;
                                break;
                            }

                            return _context3.abrupt('return', next(new _ApiError2.default(422, "price is required")));

                        case 5:
                            _context3.next = 7;
                            return _priceOfKm2.default.findByIdAndUpdate(req.params.id, req.body, { new: true });

                        case 7:
                            price = _context3.sent;
                            return _context3.abrupt('return', res.status(200).json(price));

                        case 11:
                            _context3.prev = 11;
                            _context3.t0 = _context3['catch'](0);

                            next(_context3.t0);

                        case 14:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3, [[0, 11]]);
        }))();
    },

    //deactive user account
    deactiveUser: function deactiveUser(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var userId, userDetails, newUser;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;

                            if (req.user.type == "ADMIN") {
                                _context4.next = 3;
                                break;
                            }

                            return _context4.abrupt('return', next(new _ApiError2.default(403, "not admin user")));

                        case 3:
                            userId = req.params.userId;
                            _context4.next = 6;
                            return _user2.default.findById(userId);

                        case 6:
                            userDetails = _context4.sent;

                            if (userDetails) {
                                _context4.next = 9;
                                break;
                            }

                            return _context4.abrupt('return', next(new _ApiError2.default(404)));

                        case 9:
                            _context4.next = 11;
                            return _user2.default.findByIdAndUpdate(userId, { active: false }, { new: true });

                        case 11:
                            newUser = _context4.sent;
                            return _context4.abrupt('return', res.status(200).json(newUser));

                        case 15:
                            _context4.prev = 15;
                            _context4.t0 = _context4['catch'](0);

                            next(_context4.t0);

                        case 18:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4, [[0, 15]]);
        }))();
    },

    //active user account 
    activeUser: function activeUser(req, res, next) {
        var _this5 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
            var userId, userDetails, newUser;
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.prev = 0;

                            if (req.user.type == "ADMIN") {
                                _context5.next = 3;
                                break;
                            }

                            return _context5.abrupt('return', next(new _ApiError2.default(403, "not admin user")));

                        case 3:
                            userId = req.params.userId;
                            _context5.next = 6;
                            return _user2.default.findById(userId);

                        case 6:
                            userDetails = _context5.sent;

                            if (userDetails) {
                                _context5.next = 9;
                                break;
                            }

                            return _context5.abrupt('return', next(new _ApiError2.default(404)));

                        case 9:
                            _context5.next = 11;
                            return _user2.default.findByIdAndUpdate(userId, { active: true }, { new: true });

                        case 11:
                            newUser = _context5.sent;
                            return _context5.abrupt('return', res.status(200).json(newUser));

                        case 15:
                            _context5.prev = 15;
                            _context5.t0 = _context5['catch'](0);

                            next(_context5.t0);

                        case 18:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, _this5, [[0, 15]]);
        }))();
    }
};
//# sourceMappingURL=admin.controller.js.map