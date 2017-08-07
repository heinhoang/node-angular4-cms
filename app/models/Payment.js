const mongoose = require('mongoose');
const Joi = require('joi');

const { joiValidate } = require('../utils/security-helpers');

const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    addedBy: {
        type: String,
        trim: true,
    },
    addedOn: {
        type: Date,
        default: Date.now,
    },
    updatedBy: {
        type: String,
        trim: true,
    },
    updatedOn: {
        type: Date,
    },
    deletedBy: {
        type: String,
        trim: true,
    },
    deletedOn: {
        type: Date,
    },
});

let Payment;
try {
    Payment = mongoose.model(PaymentSchema);
} catch (error) {
    Payment = mongoose.model(PaymentSchema, 'Product');
}

module.exports = Payment;
