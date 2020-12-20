import { Schema, model } from "mongoose";

const profileSchema = new Schema({
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

export default model('profile', profileSchema);