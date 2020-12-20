import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export async function connect(){
    try{
        await mongoose.connect('mongodb://'+process.env.HOST+'/'+process.env.CONNECT, {
            useNewUrlParser: true
        });
        console.log('>>> DB connected');
    }catch(e){
        console.log('Ups ' + e);
    }
}
