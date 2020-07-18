module.exports.count = (data) => {
    let result = 0.0, price, quantity;
    for (let i=0; i< data.cart_products.length; i++) {
        price = data.cart_products[i].Product.price;
        quantity = data.cart_products[i].quantity;
        result += ( price * quantity);
    }   
    return result;
}