import { Schema, model } from "mongoose";

const addressSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    customer :{
        type: Number,
        required: true,
        ref:'customer'
    },
    city :{
        type: Number,
        required: true,
        ref:'city'
    },
    address: {
        type: String,
        required: true
    }
});

export default model('address', addressSchema);