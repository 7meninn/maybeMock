class CartError extends Error {
  // Your code here
}

class OutOfStockError extends CartError {
  // Your code here
}

class InvalidCouponError extends CartError {
  // Your code here
}

class Cart {
  // Your code here
}

module.exports = { Cart, CartError, OutOfStockError, InvalidCouponError };
