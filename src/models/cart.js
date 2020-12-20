import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    customer :{
        type: Number,
        required: true,
        ref:'customer'
    },
    address: {
        type: Number,
        required: true,
        ref:'address'
    },
    date: {
        type: String,
        required: true
    }
});

export default model('cart', cartSchema);