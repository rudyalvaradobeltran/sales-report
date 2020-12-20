import { Schema, model } from "mongoose";

const productSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    category: {
        type: Number,
        required: true,
        ref:'category'
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

export default model('product', productSchema);