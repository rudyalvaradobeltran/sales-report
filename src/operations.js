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

/**********
 * SOLD PRODUCTS
 * totalOrderDetails, totalSoldItems, distinctSoldProducts
*/
exports.soldProducts = async () => {
    var promise = await orderDetail.aggregate([{
        $facet: {
            "orderQuantity": [{ $match: {} },{ $group: { _id: 1, totalOrderDetails: { $sum: 1 }, totalSoldItems : { $sum: "$quantity" } } }],
            "products": [{ $match: {} },{ $group: { _id: "$product"}  },{ $group: { _id: 2, distinctSoldProducts: { $sum: 1 } } }]
        }
    }]);
    return promise;
}

/**********
 * STOCK PRODUCTS
 * totalStock, inventoryValuation
*/
exports.stockProducts = async () => {
    var promise = await product.aggregate([{ $match: {} },
    { $group: { _id: 3, totalStock : { $sum: "$quantity" }, inventoryValuation : { $sum: { $multiply: ["$price", "$quantity"] } } } }]);
    return promise;
}

/**********
 * ORDERS
 * totalOrders, totalRevenue
*/
exports.totalOrders = async () => {
    var promise = await order.aggregate([{ $match: {} },
    { $group: { _id: 4, totalOrders: { $sum: 1 }, totalRevenue : { $sum: "$total" } } }]);
    return promise;
}

/**********
 * ORDERS BY MONTH
 * totalOrders, totalRevenue
*/
exports.ordersByMonth = async () => {
    var promise = await order.aggregate([
        {$group: {
            _id: {$substr: ['$date', 3, 2]}, 
            totalOrders: {$sum: 1},
            totalRevenue: {$sum: "$total"}
        }},
        { $sort : { _id : 1 } },
    ]);
    return promise;
}

/**********
 * ORDERS BY CITY
 * city, ordersCount
*/
exports.ordersByCity = async () => {
    var promise = await city.aggregate([
        {
            $lookup: {
                from: "addresses",
                localField:"_id",
                foreignField:"city",
                as: "addressDetail"
            }
        }, {
            $lookup: {
                from: "orders",
                localField: "addressDetail._id",
                foreignField: "address",
                as: "ordersDetail",
            }
        },{
            $unwind: "$ordersDetail"  
        },{
            $group: {
                _id: { id: "$_id", city: "$name" },
                orders: { $addToSet: "$ordersDetail._id" }, 
                ordersCount: { $sum: 1 }
            },
        }]);
    return promise;
}

/**********
 * ORDERSDETAIL BY CATEGORY
 * category, orderDetailCount
*/
exports.ordersDetailByCategory = async () => {
    var promise = await category.aggregate([
        {
            $lookup: {
                from: "products",
                localField:"_id",
                foreignField:"category",
                as: "productsDetail"
            }
        }, {
            $lookup: {
                from: "orderdetails",
                localField: "productsDetail._id",
                foreignField: "product",
                as: "orderDetailsDetails",
            }
        },{
            $unwind: "$orderDetailsDetails"  
        },{
            $group: {
                _id: { id: "$_id", category: "$name" },
                orderDetails: { $addToSet: "$orderDetailsDetails._id" }, 
                orderDetailsCount: { $sum: "$orderDetailsDetails.quantity" }
            },
        }]);
    return promise;
}

/**********
 * BEST SELLING PRODUCT PER MONTH
 * id, name, quantity
*/
exports.bestSellingProductPerMonth = async () => {
    var promise = await order.aggregate([
        {
            $lookup: {
                from: "orderdetails",
                localField: "_id",
                foreignField: "order",
                as: "orderDetailsDetails",
            }
        },{
            $unwind: "$orderDetailsDetails"  
        },
        {
            $lookup: {
                from: "products",
                localField: "orderDetailsDetails.product",
                foreignField: "_id",
                as: "productsDetails",
            }
        },{
            $unwind: "$productsDetails"  
        },{
            $group: {
                _id: {
                    month: {$substr: ['$date', 3, 2]}
                }, 
                product: {
                    $addToSet: "$orderDetailsDetails.product",
                    $addToSet: {
                        name: "$productsDetails.name",
                        quantity: { $sum: "$orderDetailsDetails.quantity" }
                    }
                }
            },
        }
    ]);
    return promise;
}

/**********
 * BEST SELLING PRODUCT PER YEAR
 * id, name, stock quantity
*/
exports.bestSellingProductPerYear = async (year) => {
    var promise = await order.aggregate([
        {
            $match: {
                date: {
                    $gte: "01/01/"+year,
                    $lte: "31/12/"+year
                }
            }
        },
        {
            $lookup: {
                from: "orderdetails",
                localField: "_id",
                foreignField: "order",
                as: "orderDetailsDetails",
            }
        },{
            $unwind: "$orderDetailsDetails"  
        },
        {
            $lookup: {
                from: "products",
                localField: "orderDetailsDetails.product",
                foreignField: "_id",
                as: "productsDetails",
            }
        },{
            $unwind: "$productsDetails"  
        },{
            $group: {
                _id: {
                    product: "$productsDetails._id"
                }, 
                product: {
                    $addToSet: {
                        name: "$productsDetails.name",
                        stock: { $sum: "$productsDetails.quantity" }
                    }
                },
                quantity: {
                    $sum: { $sum: "$orderDetailsDetails.quantity" }
                }
            },
        }]);
    return promise;
}

/**********
 * PRODUCTS
 * max, min, avg
*/
exports.products = async (year) => {
    var promise = await product.aggregate([{
        $facet: {
            "max": [{ $sort: { price: -1 } },
                    { $group: { 
                        _id: null,
                        name: { $first: "$name" },
                        price: { $first: "$price" }
                    }}],
            "min": [
                { $sort: { price: +1 } },
                { $group: { 
                    _id: null,
                    name: { $first: "$name" },
                    price: { $first: "$price" }
                }}
            ]
        }
    }]);
    return promise;
}