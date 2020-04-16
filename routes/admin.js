const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// // /admin/add-product => GET request
router.get('/add-product', isAuth, adminController.getAddProduct);

// // /admin/products => GET request
router.get('/products', isAuth, adminController.getProducts);

// // /admin/add-product => POST request
router.post('/add-product', isAuth, [
    body('title')
    .isString()
    .trim()
    .isLength({ min: 3 }),
    body('price')
    .isFloat(),
    body('description')
    .trim()
    .isLength({ min: 6, max: 350 })
],
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', isAuth, [
    body('title')
    .isString()
    .trim()
    .isLength({ min: 3 }),
    body('price')
    .isFloat(),
    body('description')
    .trim()
    .isLength({ min: 6, max: 350 })
], 
    adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;