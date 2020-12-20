import { Schema, model } from "mongoose";

const categorySchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
});

export default model('category', categorySchema);