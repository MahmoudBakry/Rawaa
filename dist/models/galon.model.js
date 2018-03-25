'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GalonSchema = new _mongoose.Schema({
    img: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    typeOfOrder: {
        type: String,
        enum: ['buying', 'substitution'],
        default: 'buying'
    },
    minimumNumberOnOrder: {
        type: Number,
        default: 3
    },
    user: {
        type: Number,
        ref: "user"
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

GalonSchema.set('toJSON', {
    transform: function transform(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
GalonSchema.plugin(_mongooseAutoIncrement2.default.plugin, 'galon');

exports.default = _mongoose2.default.model("galon", GalonSchema);
//# sourceMappingURL=galon.model.js.map