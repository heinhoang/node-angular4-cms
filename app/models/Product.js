const mongoose = require('mongoose');
const Joi = require('joi');

const { joiValidate } = require('../utils/security-helpers');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
        validate: {
            validator(image) {
                return image ?
                    joiValidate({ image }, { image: Joi.string().regex(/(\/.*\.\w+)/g) }) : true;
            },
        },
    },
    sku: {
        type: String,
        required: true,
        validate: {
            validator(image) {
                return image ?
                    joiValidate({ image }, { image: Joi.string().regex(/^[a-z0-9]{10,20}$/i) }) : true;
            },
        },
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

let Product;
try {
    Product = mongoose.model(ProductSchema);
} catch (error) {
    Product = mongoose.model(ProductSchema, 'Product');
}

module.exports = Product;
