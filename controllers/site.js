//Import the needed libraries.
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Import the model
// const Products = require('../models/products');

// GET / aka the homepage
exports.getHome = (req, res, next) => {
    // Get all the products.
    res.render('index.html', {
        'title': 'Home',
        'path': '/home',
    });
};

// // GET /products
// // The function delivers the list of products to the user.
// exports.getProducts = (req, res, next) => {
//     // Get all the products.
//     return Products.find({}, (err, items) => {
//         // If there was an error, throw an error with 500 error code.
//         if (err) {
//             console.log(err);
//             res.status(500).send('An error ocurred', err);
//         }
//         // If not, render the homepage with one item.
//         else {
//             res.render('products.html', {
//                 'title': 'Products',
//                 'path': '/products',
//                 'items': items
//             });
//         }
//     });
// };

// // GET /product-view/:id
// // The function delivers the product view for a certain product.
// exports.getProduct = (req, res, next) => {
//     // Get the id from the URL.
//     const productId = req.params.id;

//     // Find the product from the database.
//     return Products.findOne({_id: productId}, (err, item) => {
//         // If there was an error, redirect to the 500 page.
//         if (err) {
//             console.log(err);
//             res.status(500).send('An error occurred', err);
//         }
//         // If not, deliever the product view page.
//         else {
//             res.render('product-view.html', {
//                 'title': item['title'],
//                 'path': '/products',
//                 'item': item
//             });
//         }
//     });
// };

// GET /contact
// The function delivers the contact form to the user.
exports.getContact = (req, res, next) => {
    // Render the contact view.
    res.render('contact.html', {
        'title': 'Contact Us',
        'path': '/contact'
    });
};

// POST /contact
// The function handles the customer's request.
exports.postContact = (req, res, next) => {
    // Get the data from the form.
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    const comment = req.body.comment;
    const errors = validationResult(req);

    // Validate the data.
    if (firstName == '' || lastName == '' || email == '' || comment == '' || !errors.isEmpty()) {
        return res.status(422).render('contact.html', {
            title: 'Contact Us',
            path: '/contact',
            errorMessage: 'Please fill out everything in the form.',
            firstName: firstName,
            lastName: lastName,
            email: email,
            comment: comment,
        });
    }

    // Setup the transporter for the nodemailer.
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        }
    });

    // Setup the email.
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: 'Message from ' + firstName + ' ' + lastName + ' at ' + email,
        text: comment + ' - ' + email,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
            return res.status(500).send('An error ocurred', err);
        } else {
            // Render the form submitted page.
            return res.render('contact-submit.html', {
                title: 'Form Submitted',
                path: '/contact',
            });
        }
    });
};

// GET /about
// The function delivers the about us page to the user.
exports.getAbout = (req, res, next) => {
    // Render the about page.
    res.render('about.html', {
        'title': 'About Us',
        'path': '/about'
    });
};