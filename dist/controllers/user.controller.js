"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _user = require("../models/user.model");

var _user2 = _interopRequireDefault(_user);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require("../config");

var _config2 = _interopRequireDefault(_config);

var _check = require("express-validator/check");

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _ApiError = require("../helpers/ApiError");

var _ApiError2 = _interopRequireDefault(_ApiError);

var _multer = require("../services/multer");

var _index = require("../utils/index");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var jwtSecret = _config2.default.jwtSecret;

var generateToken = function generateToken(id) {

    return _jsonwebtoken2.default.sign({
        sub: id,
        iss: 'App',
        iat: new Date().getTime()
    }, jwtSecret, { expiresIn: '10000s' });
};

//function check phone regular exression 
//this function support 
// +XX-XXXX-XXXX  
// +XX.XXXX.XXXX  
// +XX XXXX XXXX 
var checkPhone = function checkPhone(inputtxt) {
    var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (inputtxt.match(phoneno)) {
        return true;
    } else {
        throw new Error("invalid phone");
    }
};
exports.default = {
    validateBody: function validateBody() {
        var _this = this;

        var isUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        return [(0, _check.body)("name").exists().withMessage("name is required"), (0, _check.body)("password").exists().withMessage("password is required"), (0, _check.body)("phone").exists().withMessage("phone is requires")
        //make custome validation to phone to check on phone[unique, isPhone]
        .custom(function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value, _ref2) {
                var req = _ref2.req;
                var userPhoneQuery, user;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                //call phone checking pattren function 
                                checkPhone(value);
                                if (isUpdate && req.user.phone == value) userQuery._id = { $ne: req.user._id };
                                userPhoneQuery = { phone: value };
                                _context.next = 5;
                                return _user2.default.findOne(userPhoneQuery);

                            case 5:
                                user = _context.sent;

                                if (!user) {
                                    _context.next = 10;
                                    break;
                                }

                                throw new Error('phone already exists');

                            case 10:
                                return _context.abrupt("return", true);

                            case 11:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, _this);
            }));

            return function (_x2, _x3) {
                return _ref.apply(this, arguments);
            };
        }())];
    },

    //signup logic 
    signUp: function signUp(req, res, next) {
        var _this2 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
            var validationErrors, createdUser;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            validationErrors = (0, _check.validationResult)(req).array();

                            if (!(validationErrors.length > 0)) {
                                _context2.next = 3;
                                break;
                            }

                            return _context2.abrupt("return", next(new _ApiError2.default(422, validationErrors)));

                        case 3:
                            _context2.prev = 3;

                            if (!req.file) {
                                _context2.next = 8;
                                break;
                            }

                            _context2.next = 7;
                            return (0, _index.toImgUrl)(req.file);

                        case 7:
                            req.body.img = _context2.sent;

                        case 8:
                            _context2.next = 10;
                            return _user2.default.create(req.body);

                        case 10:
                            createdUser = _context2.sent;

                            res.status(201).send({ user: createdUser, token: generateToken(createdUser.id) });
                            _context2.next = 17;
                            break;

                        case 14:
                            _context2.prev = 14;
                            _context2.t0 = _context2["catch"](3);

                            next(_context2.t0);

                        case 17:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[3, 14]]);
        }))();
    },


    //sign in logic 
    signin: function signin(req, res, next) {
        var _this3 = this;

        return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
            var user;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            user = req.user; // Passport

                            console.log(user.type);
                            res.send({ user: user, token: generateToken(user.id) });

                        case 3:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, _this3);
        }))();
    }
};
//# sourceMappingURL=user.controller.js.map