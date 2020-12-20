import { Schema, model } from "mongoose";

const customerSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    profile: {
        type: Number,
        required: true,
        ref:'profile'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
});

export default model('customer', customerSchema);