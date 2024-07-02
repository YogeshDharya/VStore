const httpStatus = require("http-status");
const { Cart, Product, User } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");
const { http } = require("winston");

// TODO: CRIO_TASK_MODULE_CART - Implement the Cart service methods

/**
 * Fetches cart for a user 
 * - Fetch user's cart from Mongo 
 * - If cart doesn't exist, throw ApiError 
 * --- status code  - 404 NOT FOUND 
 * --- message - "User does not have a cart" 

/**
 * Fetches cart for a user
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
  const cart = await Cart.findOne({ email: user.email });
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }
  return cart;
};

/** 
 * Adds a new product to cart 
 * - Get user's cart object using "Cart" model's findOne() method 
 * --- If it doesn't exist, create one 
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code 
 * 
 * - If product to add already in user's cart, throw ApiError with 
 * --- status code  - 400 BAD REQUEST 
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart" 
 * 
 * - If product to add not in "products" collection in MongoDB, throw ApiError with 
 * --- status code  - 400 BAD REQUEST 
 * --- message - "Product doesn't exist in database" 
 * 
 * - Otherwise, add product to user's cart 
 * 
 * 
 * 
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
    const productIndex = await cart.cartItems.findIndex(ele => ele.product_id == productId);
 * 
 */
const addProductToCart = async (user, productId, quantity) => {
  //get the user's cart object by using user's mail id
  let cart = await Cart.findOne({ email: user.email });
  if (!cart) {
    try {
      cart = await Cart.create({
        email: user.email,
        cartItems: [],
        paymentOption: config.default_payment_option,
      });
      // await cart.save();
    } catch (error) {
      // if cart creation fails throw internal error, status 500
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "User cart Creation failed."
      );
    }
  }

  if (cart == null) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "USer does not have a cart"
    );
  }

  let productIndex = false;

  for (let i = 0; i < cart.cartItems.length; i++) {
    if (productId == cart.cartItems[i].product._id) {
      productIndex = true;
    }
  }
//  console.log(cart.cartItems);
  if (!productIndex) {
    let product = await Product.findById({ _id: productId });
    if (product == null) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Product does not exist in database"
      );
    }
    cart.cartItems.push({ product, quantity });
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product is already in card. Use sidebar to update the quatity of the product."
    );
  }
  await cart.save();
  return cart;
};

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided and return the cart object
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const updateProductInCart = async (user, productId, quantity) => {
  let userCart = await Cart.findOne({ email: user.email });

  if (!userCart) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User does not have a cart. Use POST to create cart and add a product"
    );
  }

  let productExists = await Product.findOne({ _id: productId }); //product_id
  //  console.log("pr ex",productExists)
  if (!productExists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product doesn't exist in database"
    );
  }
  let productIndex = -1;
  //console.log("asdf",userCart.cartItems)
  for (let i = 0; i < userCart.cartItems.length; i++) {
    if (userCart.cartItems[i].product._id == productId) {
      productIndex = i;
    }
  }
  //  console.log("products", productIndex)
  if (productIndex == -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }
  userCart.cartItems[productIndex].quantity = quantity;

  await userCart.save();
  return userCart;
};

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 *     userCart.cartItems.findIndex( ele=>ele.product_id === productId)
 */
const deleteProductFromCart = async (user, productId) => {
  let userCart = await Cart.findOne({ email: user.email });
  if (userCart === null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart");
  }
  let productIndex = -1;
  for (let i = 0; i < userCart.cartItems.length; i++) {
    if (userCart.cartItems[i].product._id == productId) {
      productIndex = i;
      break;
    }
  }
  if (productIndex == -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }
  userCart.cartItems.splice(productIndex, 1);
  await userCart.save();
};
// TODO: CRIO_TASK_MODULE_TEST - Implement checkout function
// checkout a users cart
// On success user cart must have no products
//   @param {User} user
//   @returns {Promise}
//   @throw {ApiError} when cart is invalid
const checkout = async (user) => {
  const userCart = await getCartByUser(user);
  if (userCart == null) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Cart Empty !");
  }
  if(userCart.cartItems.length === 0 ){
    throw new ApiError(httpStatus.BAD_REQUEST,"No Products in User's Cart")
  }
  let address = await user.hasSetNonDefaultAddress();
  if (!address) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Address Not Set");
  }
  let totalCost = 0;
  userCart.cartItems.forEach((ele) => {
    totalCost += ele.product.cost * ele.quantity;
  });
  if (totalCost > user.walletMoney) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Insufficient Wallet Balance !"
    );
  }
  userCart.cartItems = []; 
  user.walletMoney -= totalCost; 
  await user.save(); 
  await userCart.save(); 
  return userCart; 
};
module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  checkout,
  deleteProductFromCart,
};
