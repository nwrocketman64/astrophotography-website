// Import the need libraries.
const express = require('express');
const { check, body } = require('express-validator');

// Import the auth code middleware.
const isAuth = require('../middleware/is-auth');

// Import the admin controller
const adminController = require('../controllers/admin');

// Setup the router.
const router = express.Router();

// GET /admin/add-image
router.get('/add-image', isAuth, adminController.getAddImage);

// POST /admin/add-products
// router.post(
//     '/add-products',
//     isAuth,
//     [
//         body('name').not().isEmpty().trim().escape(),
//         body('options').not().isEmpty().trim().escape(),
//         body('description').not().isEmpty().trim().escape(),
//         body('url').not().isEmpty().trim(),
//         body('price').isNumeric(),
//     ],
//     adminController.postAddProduct
// );

// GET /admin/edit-product/:id
// router.get('/edit-product/:id', isAuth, adminController.getEditProduct);

// POST /admin/edit-product/:id
// router.post(
//     '/edit-product/:id',
//     isAuth,
//     [
//         body('name').not().isEmpty().trim().escape(),
//         body('options').not().isEmpty().trim().escape(),
//         body('description').not().isEmpty().trim().escape(),
//         body('url').not().isEmpty().trim(),
//         body('price').isNumeric(),
//     ],
//     adminController.postEditProduct);

// GET /admin/delete-product/:id
// router.get('/delete-product/:id', isAuth, adminController.getDeleteProduct);

// POST /admin/delete-product/:id
// router.post('/delete-product/:id', isAuth, adminController.postDeleteProduct);

// GET /admin/reset-password
router.get('/reset-password', isAuth, adminController.getResetPassword);

// POST /admin/reset-password
router.post(
    '/reset-password',
    isAuth,
    [
        body('password').isLength({ min: 5 }).trim(),
        body('cpassword').isLength({ min: 5 }).trim(),
    ],
    adminController.postResetPassword
);

// GET /admin
router.get('/', isAuth, adminController.getAdmin);

// Export the router.
module.exports = router;