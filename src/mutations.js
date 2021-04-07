import address from "./models/address";
import category from "./models/category";
import city from "./models/city";
import customer from "./models/customer";
import product from "./models/product";
import profile from "./models/profile";
import cart from "./models/cart";
import cartDetail from "./models/cartDetail";
import order from "./models/order";
import orderDetail from "./models/orderDetail";

import addressList from "./data/addresses.json";
import categoryList from "./data/categories.json";
import cityList from "./data/cities.json";
import customerList from "./data/customers.json";
import productList from "./data/products.json";
import profileList from "./data/profiles.json";

import dotenv from 'dotenv';
import Chance from 'chance';
import moment from 'moment';
dotenv.config();

export const Mutation = {
    async deleteCarts(_){
        await cart.deleteMany({});
        return await cart.find();
    },
    async deleteCartsDetail(_){
        await cartDetail.deleteMany({});
        return await cartDetail.find();
    },
    async deleteOrders(_){
        await order.deleteMany({});
        return await order.find();
    },
    async deleteOrdersDetail(_){
        await orderDetail.deleteMany({});
        return await orderDetail.find();
    },
    async bulkInsertCategory(_){
        return await category.insertMany(categoryList);
    },
    async bulkInsertProduct(_){
        return await product.insertMany(productList);
    },
    async bulkInsertCity(_){
        return await city.insertMany(cityList);
    },
    async bulkInsertProfile(_){
        return await profile.insertMany(profileList);
    },
    async bulkInsertCostumer(_){
        return await customer.insertMany(customerList);
    },
    async bulkInsertAddress(_){
        return await address.insertMany(addressList);
    },
    async bulkInsertCart(_){
        var count = 0;
        for(let i = 1000; i < parseInt(process.env.SALES)+1000; i++) { //ventas temporales en el carro
            var customerId = Math.round(Math.random()*(100-1)+parseInt(1));
            await address.findOne({ customer: customerId } , async function (err, currentAddress) { 
                try{ 
                    var newCart = await new cart();
                    newCart._id = i;
                    newCart.customer = customerId;
                    newCart.address = currentAddress._id;
                    var chance = new Chance();
                    newCart.date = moment(chance.date({american: false, year: process.env.YEAR})).format('DD/MM/YYYY');
                    await newCart.save();
                    count = count + 1;
                }catch(error){
                    console.log(error);
                }
            });
        }
        return cart.find();
    },
    async bulkInsertCartDetail(_){
        await cart.find()
            .then(carts => {
                carts.forEach(async (element) => {
                    try{
                        var quantityOfProducts = Math.round(Math.random()*(3-1)+parseInt(1));
                        for(let i = 1; i <= quantityOfProducts; i++) { //productos vendidos
                            var newCartDetail = await new cartDetail();
                            newCartDetail.cart = element._id;
                            newCartDetail.product = Math.round(Math.random()*(1000-1)+parseInt(1));
                            newCartDetail.quantity = Math.round(Math.random()*(5-1)+parseInt(1));
                            await newCartDetail.save();
                        }
                    }catch(error){
                        console.log(error);
                    }
                });
            }).catch(function(e) {
                console.log(e);
            })
        return cartDetail.find();
    },
    async bulkInsertOrder(_){
        await cart.find()
            .then(carts => {
                carts.forEach(async (element) => {
                    try{
                        var total = 0;
                        await cartDetail.find({ cart: element._id }).populate('product')
                            .then(cartsDetail => {
                                cartsDetail.forEach(async (elementDetail) => {
                                    try{
                                        total = total + elementDetail.product.price;
                                    }catch(error){
                                        console.log(error);
                                    }
                                });
                            });
                        var newOrder = await new order();
                        newOrder._id = element._id;
                        newOrder.cart = element._id;
                        newOrder.address = element.address;
                        newOrder.date = element.date;
                        newOrder.total = total;
                        await newOrder.save();
                    }catch(error){
                        console.log(error);
                    }
                });
            }).catch(function(e) {
                console.log(e);
            });
        return order.find();
    },
    async bulkInsertOrderDetail(_){
        await cartDetail.find()
            .then(cardsDetail => {
                cardsDetail.forEach(async (element) => {
                    try{
                        var newOrderDetail = await new orderDetail();
                        newOrderDetail._id = element._id;
                        newOrderDetail.order = element.cart;
                        newOrderDetail.product = element.product;
                        newOrderDetail.quantity = element.quantity;
                        await newOrderDetail.save();
                    }catch(error){
                        console.log(error);
                    }
                });
            }).catch(function(e) {
                console.log(e);
            });
        return orderDetail.find();
    }
};