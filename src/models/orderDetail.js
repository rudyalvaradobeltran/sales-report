import { Schema, model } from "mongoose";

const orderDetailSchema = new Schema({
    order :{
        type: Number,
        required: true,
        ref:'order'
    },
    product: {
        type: Number,
        required: true,
        ref:'product'
    },
    quantity: {
        type: Number,
        required: true
    }
});

export default model('orderDetail', orderDetailSchema);