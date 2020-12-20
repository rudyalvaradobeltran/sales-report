import { Schema, model } from "mongoose";

const orderSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    cart :{
        type: Number,
        required: true,
        ref:'cart'
    },
    address: {
        type: Number,
        required: true,
        ref:'address'
    },
    date: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
});

export default model('order', orderSchema);