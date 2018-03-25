'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _cartona = require('../../models/cartona.model');

var _cartona2 = _interopRequireDefault(_cartona);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _check = require('express-validator/check');

var _index = require('../../utils/index');

var _ApiError = require('../../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _ApiResponse = require('../../helpers/ApiResponse');

var _ApiResponse2 = _interopRequireDefault(_ApiResponse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
    validateBody: function validateBody() {
        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        return [(0, _check.body)("numberOfBottles").exists().withMessage("numberOfBottles is required"), (0, _check.body)("sizeOfBottles").exists().withMessage("sizeOfBottles is required"),
        // body("img").exists().withMessage("img is required"),
        (0, _check.body)("price").exists().withMessage("price is required")];
    },

    //create new cartona product
    createCartona: function createCartona(req, res, next) {
        var _this = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var validationErrors, newDoc;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context.next = 3;
                                break;
                            }

                            return _context.abrupt('return', next(new _ApiError2.default(422, validationErrors)));

                        case 3:
                            _context.prev = 3;

                            if (!(req.user.type == "PROVIDER")) {
                                next(new _ApiError2.default(403, 'not provider user'));
                            }

                            if (!req.file) {
                                _context.next = 11;
                                break;
                            }

                            _context.next = 8;
                            return (0, _index.toImgUrl)(req.file);

                        case 8:
                            req.body.img = _context.sent;
                            _context.next = 12;
                            break;

                        case 11:
                            next(new _ApiError2.default(422, 'img is required'));

                        case 12:
                            req.body.user = req.user._id;
                            _context.next = 15;
                            return _cartona2.default.create(req.body);

                        case 15:
                            newDoc = _context.sent;
                            return _context.abrupt('return', res.status(201).json(newDoc));

                        case 19:
                            _context.prev = 19;
                            _context.t0 = _context['catch'](3);

                            next(_context.t0);

                        case 22:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, _this, [[3, 19]]);
        }))();
    },

    //retrive all cartona products 
    allCartones: function allCartones(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var limit, page, query, docsCount, allDocs;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            limit = parseInt(req.query.limit) || 20;
                            page = req.query.page || 1;
                            query = {};

                            if (req.query.typeOfSize) query.typeOfSize = req.query.typeOfSize;
                            _context2.prev = 4;
                            _context2.next = 7;
                            return _cartona2.default.count(query);

                        case 7:
                            docsCount = _context2.sent;
                            _context2.next = 10;
                            return _cartona2.default.find(query).populate('user').skip(page * limit - limit).limit(limit).sort({ creationDate: -1 });

                        case 10:
                            allDocs = _context2.sent;
                            return _context2.abrupt('return', res.send(new _ApiResponse2.default(allDocs, page, Math.ceil(docsCount / limit), limit, docsCount, req)));

                        case 14:
                            _context2.prev = 14;
                            _context2.t0 = _context2['catch'](4);

                            next(_context2.t0);

                        case 17:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[4, 14]]);
        }))();
    },

    //update cartone
    updateCartona: function updateCartona(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var cartonID, carton, newCartonw;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            cartonID = req.params.cartonID;
                            _context3.prev = 1;
                            _context3.next = 4;
                            return _cartona2.default.findById(cartonID);

                        case 4:
                            carton = _context3.sent;

                            if (req.user.id == carton.user) {
                                _context3.next = 7;
                                break;
                            }

                            return _context3.abrupt('return', next(new _ApiError2.default(403, "not have access to this resourse")));

                        case 7:
                            if (!req.file) {
                                _context3.next = 11;
                                break;
                            }

                            _context3.next = 10;
                            return (0, _index.toImgUrl)(req.file);

                        case 10:
                            req.body.img = _context3.sent;

                        case 11:
                            _context3.next = 13;
                            return _cartona2.default.update({ _id: cartonID }, {
                                $set: {
                                    numberOfBottles: req.body.numberOfBottles || carton.numberOfBottles,
                                    sizeOfBottles: req.body.sizeOfBottles || carton.sizeOfBottles,
                                    typeOfSize: req.body.typeOfSize || carton.typeOfSize,
                                    price: req.body.price || carton.price,
                                    img: req.body.img || carton.img,
                                    minimumNumberOnOrder: req.body.minimumNumberOnOrder || carton.minimumNumberOnOrder
                                }
                            });

                        case 13:
                            _context3.next = 15;
                            return _cartona2.default.findById(carton).populate('user');

                        case 15:
                            newCartonw = _context3.sent;
                            return _context3.abrupt('return', res.status(200).json(newCartonw));

                        case 19:
                            _context3.prev = 19;
                            _context3.t0 = _context3['catch'](1);

                            next(_context3.t0);

                        case 22:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3, [[1, 19]]);
        }))();
    },


    //retrive one cartone details 
    cartonDetails: function cartonDetails(req, res, next) {
        var _this4 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var cartonId, carton;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;

                            if (!req.params.cartonID) next(new _ApiError2.default(422, "missed cartonID"));
                            cartonId = req.params.cartonID;
                            _context4.next = 5;
                            return _cartona2.default.findById(cartonId).populate('user');

                        case 5:
                            carton = _context4.sent;

                            if (carton) {
                                _context4.next = 8;
                                break;
                            }

                            return _context4.abrupt('return', res.status(404).end());

                        case 8:
                            return _context4.abrupt('return', res.status(200).json(carton));

                        case 11:
                            _context4.prev = 11;
                            _context4.t0 = _context4['catch'](0);

                            next;

                        case 14:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, _this4, [[0, 11]]);
        }))();
    }
};
//# sourceMappingURL=cartona.controller.js.map