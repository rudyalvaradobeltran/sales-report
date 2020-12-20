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

export const Query = {
    async addresses(){
        return await address.find().populate('customer').populate('city');
    },
    async categories(){
        return await category.find();
    },
    async cities(){
        return await city.find();
    },
    async customers(){
        return await customer.find().populate('profile');
    },
    async products(){
        return await product.find().populate('category');
    },
    async profiles(){
        return await profile.find();
    },
    async carts(){
        return await cart.find().populate('address').populate('customer').populate('cartDetail');
    },
    async cartsDetail(){
        return await cartDetail.find().populate('product').populate({
            path: 'cart',
            populate: { path: 'customer' }
        });
    },
    async orders(){
        return await order.find().populate({
            path: 'cart',
            populate: { path: 'customer' }
        }).populate({
            path: 'address',
            populate: { 
                path: 'city'
            }
        });
    },
    async ordersDetail(){
        return await orderDetail.find().populate('product').populate({
            path: 'order',
            populate: { 
                path: 'cart',
                populate: {
                    path: 'customer'
                }
            }
        });
    }
}