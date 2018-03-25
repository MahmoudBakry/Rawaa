'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _galon = require('../../models/galon.model');

var _galon2 = _interopRequireDefault(_galon);

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

        return [(0, _check.body)("size").exists().withMessage("numberOfBottles is required"), (0, _check.body)("price").exists().withMessage("sizeOfBottles is required")];
    },

    //create new galon
    createGalon: function createGalon(req, res, next) {
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
                            return _galon2.default.create(req.body);

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


    //retrive all galons 
    allGalons: function allGalons(req, res, next) {
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
                            _context2.prev = 3;
                            _context2.next = 6;
                            return _galon2.default.count(query);

                        case 6:
                            docsCount = _context2.sent;
                            _context2.next = 9;
                            return _galon2.default.find(query).populate('user').skip(page * limit - limit).limit(limit).sort({ creationDate: -1 });

                        case 9:
                            allDocs = _context2.sent;
                            return _context2.abrupt('return', res.send(new _ApiResponse2.default(allDocs, page, Math.ceil(docsCount / limit), limit, docsCount, req)));

                        case 13:
                            _context2.prev = 13;
                            _context2.t0 = _context2['catch'](3);

                            next(_context2.t0);

                        case 16:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, _this2, [[3, 13]]);
        }))();
    }
};
//# sourceMappingURL=galon.controller.js.map