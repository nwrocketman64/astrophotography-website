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

// POST /admin/add-image
router.post(
    '/add-image',
    isAuth,
    [
        body('object').not().isEmpty().trim().escape(),
        body('date').not().isEmpty().trim().escape(),
        body('location').not().isEmpty().trim().escape(),
        body('telescope').not().isEmpty().trim().escape(),
        body('comments').not().isEmpty().trim().escape(),
    ],
    adminController.postAddImage
);

// GET /admin/edit-image/:id
router.get('/edit-image/:id', isAuth, adminController.getEditImage);

// POST /admin/edit-image
router.post(
    '/edit-image',
    isAuth,
    [
        body('object').not().isEmpty().trim().escape(),
        body('date').not().isEmpty().trim().escape(),
        body('location').not().isEmpty().trim().escape(),
        body('telescope').not().isEmpty().trim().escape(),
        body('comments').not().isEmpty().trim().escape(),
    ],
    adminController.postEditImage
);

// GET /admin/delete-image/:id
router.get('/delete-image/:id', isAuth, adminController.getDeleteImage);

// POST /admin/delete-image/:id
router.post('/delete-image/:id', isAuth, adminController.postDeleteImage);

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