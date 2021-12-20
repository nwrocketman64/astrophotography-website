// Import the need libraries.
const express = require('express');
const { check, body } = require('express-validator');

// Import the auth controller
const authController = require('../controllers/auth');

// Setup the router.
const router = express.Router();

// GET /login
router.get('/login', authController.getLogin);

// POST /login
router.post(
    '/login',
    [
        body('username').not().isEmpty().trim(),
        body('password').isLength({ min: 5 }).trim()
    ],
    authController.postLogin
);

// POST /logout
router.post('/logout', authController.postLogout);

// Export the router.
module.exports = router;