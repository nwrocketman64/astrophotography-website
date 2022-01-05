// Import the need libraries.
const express = require('express');
const { check, body } = require('express-validator');

// Import the shop controller
const siteController = require('../controllers/site');

// Setup the router.
const router = express.Router();

// GET / aka the homepage
router.get('/', siteController.getHome);

// GET /images
router.get('/images', siteController.getImages);

// GET /image-view/:id
router.get('/image-view/:id', siteController.getImage);

// GET /download-image/:id
router.get('/download-image/:id', siteController.getFullImage);

// GET /contact
router.get('/contact', siteController.getContact);

// POST /contact
router.post(
    '/contact',
    [
        body('fname').not().isEmpty().trim().escape(),
        body('lname').not().isEmpty().trim().escape(),
        body('email').isEmail().normalizeEmail(),
        body('comment').not().isEmpty().trim().escape(),
    ],
    siteController.postContact
);

// GET /about
router.get('/about', siteController.getAbout);

// Export the router
module.exports = router;