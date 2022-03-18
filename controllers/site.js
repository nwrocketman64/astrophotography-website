//Import the needed libraries.
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

// Import the model
const MetaPic = require('../models/meta-pic');

// GET / aka the homepage
// The function renders the home page.
exports.getHome = (req, res, next) => {
    // Get all the products.
    MetaPic.findOne()
        .lean()
        .sort('-date')
        .select('object date fullImg')
        .then(images => {
            // Render the home page with the lastest image.
            return res.render('index.html', {
                title: 'Home',
                path: '/home',
                image: images,
            });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// GET /images/:page
// The function renders the image list view.
exports.getImages = async (req, res, next) => {
    // Get the page number from the URL.
    let page = parseInt(req.params.page);

    // Validate the page number.
    if (!page || page === "" || page <= 0 || !Number.isInteger(page)) {
        // If the validation fails, set page to one as default.
        page = 1;
    };

    // Get the total number of records in the collection.
    let totalDoc = 0;
    await MetaPic.estimatedDocumentCount()
        .then(results => {
            // Save the number of documents.
            totalDoc = results;
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // Compute the number of pages in for all the photos.
    let last = Math.ceil(totalDoc / 9);

    // If the page is greater than the last page, set the page to the last.
    if (page > last) {
        page = last;

        // If there is no content, set page and last to 1;
        if (page <= 0) {
           page = 1;
           last = 1;
        }; 
    };

    // Get all the images for the current page.
    MetaPic.find()
        .lean()
        .sort('-date')
        .skip((9 * page) - 9)
        .limit(9)
        .select('object date fullImg')
        .then(images => {
            // Declare the other needed values.
            let first = false;
            let prev = '';
            let next = '';

            // If the page is greater than 1.
            if (page > 1) {
                // Set first to true and compute the prev page.
                first = 1;
                prev = page - 1;
            };

            // If the page is the last page.
            if (last == page) {
                // Set last link to nothing.
                last = '';
            } else {
                // If not, compute the next page.
                next = page + 1;
            };

            // Render the image list page.
            return res.render('images-list.html', {
                title: 'List of Images',
                path: '/images',
                images: images,
                current: page,
                first: first,
                last: last,
                prev: prev,
                next: next,
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
        .select('object date location telescope comments fullImg')
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

// GET /patch-notes
exports.getPatchNotes = (req, res, next) => {
    // Render the patch notes page.
    res.render('patch-notes.html', {
        'title': 'Patch Notes',
        'path': '/about',
    });
};
