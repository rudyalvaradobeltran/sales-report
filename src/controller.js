import dotenv from 'dotenv';
dotenv.config();
import { soldProducts, stockProducts, totalOrders, ordersByMonth, ordersByCity, 
    ordersDetailByCategory, bestSellingProductPerMonth, bestSellingProductPerYear, products } from "./operations";

const money = (value) => {
    return new Intl.NumberFormat('es-CL', {currency: 'CLP', style: 'currency'}).format(value);
}

exports.main = async(req, res) => {
    try{
        const totals = await exports.totals();
        const ordersByMonth = await exports.ordersByMonth();
        const ordersByCity = await exports.ordersByCity();
        const ordersDetailByCategory = await exports.ordersDetailByCategory();
        const bestSellingProductPerMonth = await exports.bestSellingProductPerMonth();
        const bestSellingProductPerYear = await exports.bestSellingProductPerYear();
        res.json({
            totals: totals,
            ordersByMonth: ordersByMonth,
            ordersByCity: ordersByCity,
            ordersDetailByCategory: ordersDetailByCategory,
            bestSellingProductPerMonth: bestSellingProductPerMonth,
            bestSellingProductPerYear: bestSellingProductPerYear
        });
    }catch(error){
        console.log(error);
    }
}

exports.totals = async () => {
    try{
        const getSoldProducts = await soldProducts();
        const getStockProducts = await stockProducts();
        const getOrderCount = await totalOrders();
        const getTotalOrderDetails = getSoldProducts[0].orderQuantity[0].totalOrderDetails; //1
        const getTotalSoldItems = getSoldProducts[0].orderQuantity[0].totalSoldItems;
        const getDistinctSoldProducts = getSoldProducts[0].products[0].distinctSoldProducts;
        const getTotalStock = getStockProducts[0].totalStock; //2
        var getInventoryValuation = getStockProducts[0].inventoryValuation;
        const getTotalOrders = getOrderCount[0].totalOrders;
        var getTotalRevenue = getOrderCount[0].totalRevenue;
        const getTotalItems = getTotalSoldItems + getTotalStock; //1 + 2
        var getTotalValuation = getTotalRevenue + getInventoryValuation;
        return {
            totalRevenue: money(getTotalRevenue),
            totalOrders: getTotalOrders,
            totalOrderDetails: getTotalOrderDetails,
            totalSoldItems: getTotalSoldItems,
            distinctSoldProducts: getDistinctSoldProducts,
            totalItems: getTotalItems,
            totalStock: getTotalStock,
            totalValuation: money(getTotalValuation),
            inventoryValuation: money(getInventoryValuation)
        };
    }catch(error){
        console.log(error);
    }
}

exports.ordersByMonth = async () => {
    const getOrdersByMonth = await ordersByMonth();
    getOrdersByMonth.forEach((element, index) => {
        if(index > 0){
            let thisMonthOrders = element.totalOrders;
            let lastMonthOrders = getOrdersByMonth[index-1].totalOrders;
            let thisMonthRevenue = element.totalRevenue;
            let lastMonthRevenue = getOrdersByMonth[index-1].totalRevenue;
            element.fluctuationOfOrders = Math.round(((thisMonthOrders-lastMonthOrders)/lastMonthOrders)*10000) / 100;
            element.fluctuationOfRevenue = Math.round(((thisMonthRevenue-lastMonthRevenue)/lastMonthRevenue)*10000) / 100;
        }else{
            element.fluctuationOfOrders = 0;
            element.fluctuationOfRevenue = 0;
        }
        element.totalRevenue = money(element.totalRevenue);
    });
    return { ordersByMonth: getOrdersByMonth };
}

exports.ordersByCity = async () => {
    const getOrdersByCity = await ordersByCity();
        const universe = 7000;
        var cities = [];
        getOrdersByCity.forEach((element, index) => {
            let percentage = Math.round((element.ordersCount/universe)*10000) / 100;
            cities.push({ city: element._id.city, orders: element.ordersCount, percentage: percentage });
        });
    return cities;
}

exports.ordersDetailByCategory = async () => {
    const getOrdersDetailByCategory = await ordersDetailByCategory();
    var categories = [];
    getOrdersDetailByCategory.forEach((element, index) => {
        categories.push({ category: element._id.category, itemsSold: element.orderDetailsCount });
    });
    return categories;
}

exports.bestSellingProductPerMonth = async () => {
    const getBestSellingProductPerMonth = await bestSellingProductPerMonth();
    var bestSellingProductPerMonthArr = [];
    getBestSellingProductPerMonth.forEach((element, index) => {
        let month = element._id.month;
        let arr = Object.values(element.product);
        var hash = Object.create(null);
        var result = [];
        arr.forEach(function (o) {
            if (!hash[o.name]) {
                hash[o.name] = { name: o.name, quantity: 0 };
                result.push(hash[o.name]);
            }
            hash[o.name].quantity += +o.quantity;
        });
        var max = result.reduce(function(prev, current) {
            if (+current.quantity > +prev.quantity) return current;
            return prev;
        });
        bestSellingProductPerMonthArr.push({month: month, product: max.name, quantity: max.quantity});
    });
    bestSellingProductPerMonthArr.sort((a,b) => (a.month > b.month) ? 1 : ((b.month > a.month) ? -1 : 0)); 
    return bestSellingProductPerMonthArr;
}

exports.bestSellingProductPerYear = async () => {
    const getBestSellingProductPerYear = await bestSellingProductPerYear(process.env.YEAR);
    var arr = Object.values(getBestSellingProductPerYear);
    arr.map(function(element) {
        element.diff = Math.round(((element.quantity / (element.product[0].stock + element.quantity))*100)*100) / 100;
    });
    var maxQuantity = arr.reduce(function(prev, current) {
        if (+current.quantity > +prev.quantity) return current;
        return prev;
    });
    var maxDiff = arr.reduce(function(prev, current) {
        if (+current.diff > +prev.diff) return current;
        return prev;
    });
    var minDiff = arr.reduce(function(prev, current) {
        if (+current.diff < +prev.diff) return current;
        return prev;
    });
    const bestSellingProductOfTheYear = { product: maxQuantity.product[0].name, quantity: maxQuantity.quantity };
    const bestDifferenceProduct = { product: maxDiff.product[0].name, maxDiff: maxDiff.diff };
    const lessDifferenceProduct = { product: minDiff.product[0].name, minDiff: minDiff.diff };
    const getProducts = await products();
    delete getProducts[0].max[0]._id;
    delete getProducts[0].min[0]._id;
    getProducts[0].max[0].price = money(getProducts[0].max[0].price);
    getProducts[0].min[0].price = money(getProducts[0].min[0].price);
    return {
        bestSellingProductOfYear: bestSellingProductOfTheYear,
        bestDifferenceProduct: bestDifferenceProduct,
        lessDifferenceProduct: lessDifferenceProduct,
        minMaxProducts: getProducts[0]
    }
}