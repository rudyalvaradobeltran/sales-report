import { Schema, model } from "mongoose";

const cartDetailSchema = new Schema({
    cart :{
        type: Number,
        required: true,
        ref:'cart'
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

export default model('cartDetail', cartDetailSchema);