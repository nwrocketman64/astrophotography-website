//Import the needed libraries.
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Import the model
const MetaPic = require('../models/meta-pic');

// GET / aka the homepage
// The function renders the home page.
exports.getHome = (req, res, next) => {
    // Get all the products.
    MetaPic.find()
        .lean()
        .select('object date standImg')
        .then(images => {
            // Loop through the images to find the lastest images.
            // Setup the starting images.
            let lastestImage = images[0];
            
            // Loop through each item and find the one with the lastest date.
            for (let i = 0; i < images.length; i++) {
                if (lastestImage.date < images[i].date){
                    lastestImage = images[i];
                }
            };

            // Render the home page with the lastest image.
            return res.render('index.html', {
                title: 'Home',
                path: '/home',
                image: lastestImage,
            });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /images
// The function renders the image list view.
exports.getImages = (req, res, next) => {
    MetaPic.find()
        .lean()
        .select('object date thumbImg')
        .then(images => {
            return res.render('images-list.html', {
                title: 'List of Images',
                path: '/images',
                images: images,
            });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /image-view/:id
// The function delivers the image view for a certain photo.
exports.getImage = (req, res, next) => {
    // Get the image id from the URL.
    const imageId = req.params.id;

    // Find the image and metadata from the database.
    MetaPic.findById(imageId)
        .lean()
        .select('object date location telescope comments standImg')
        .then(image => {
            return res.render('image-view.html', {
                title: 'View of ' + image.object,
                path: '/images',
                image: image,
            });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /download-image/:id
// The function sends the full size image to be download by the user.
exports.getFullImage = (req, res, next) => {
    // Get the image id from the URL.
    const imageId = req.params.id;

    // Get the full size photo from the database.
    return MetaPic.findById(imageId)
        .lean()
        .select('fullImg')
        .then(image => {
            // Set the contentType for the response.
            res.contentType(image.fullImg.contentType);

            // Send the image data.
            res.send(image.fullImg.data);
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
};

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