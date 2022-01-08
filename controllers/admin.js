// Import the needed libraries.
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Import the products model.
const Users = require('../models/user');
const MetaPic = require('../models/meta-pic');

// GET /admin/add-image
exports.getAddImage = (req, res, next) => {
    // Render the add image view
    return res.render('add-image.html', {
        title: 'Add Image',
        path: '/home'
    });
};

// POST /admin/add-image
exports.postAddImage = async (req, res, next) => {
    // Get the data from the form.
    const image = req.file;
    const object = req.body.object;
    const date = req.body.date;
    const location = req.body.location;
    const telescope = req.body.telescope;
    const comments = req.body.comments;
    const errors = validationResult(req);

    // Validate the input.
    if (!image || object == '' || date == '' || location == '' || telescope == '' || comments == '' || !errors.isEmpty()) {
        // Return to the add image page.
        return res.status(422).render('add-image.html', {
            title: 'Add Image',
            path: '/home',
            object: object,
            date: date,
            location: location,
            telescope: telescope,
            comments: comments,
            errorMessage: 'Please fill out all the form elements'
        });
    };

    // Store the new image to buffer and then resize it.
    let imgBuffer = await sharp(path.join(path.dirname(process.mainModule.filename) + '/images/' + image.filename))
        .toFormat("jpeg")
        .jpeg({
            quality: 80
        })
        .toBuffer()
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // Resize the image to standard size.
    let standImage = await sharp(imgBuffer)
        .resize({
            fit: sharp.fit.contain,
            width: 800
        })
        .toFormat("jpeg")
        .jpeg({
            quality: 80
        })
        .toBuffer()
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    
    // Resize the image to thumbnail size.
    let thumbImage = await sharp(imgBuffer)
        .resize({
            fit: sharp.fit.contain,
            width: 300
        })
        .toFormat("jpeg")
        .jpeg({
            quality: 80
        })
        .toBuffer()
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

    // Create a new image object.
    let newImage = {
        object: object,
        date: date,
        location: location,
        telescope: telescope,
        comments: comments,
        fullImg: {
            data: imgBuffer,
            contentType: "image/jpeg",
        },
        standImg: {
            data: standImage,
            contentType: "image/jpeg",
        },
        thumbImg: {
            data: thumbImage,
            contentType: "image/jpeg",
        },
    };

    // Push the data to the database.
    MetaPic.create(newImage, (err) => {
        // If there was an error.
        if (err) {
            console.log(err);
            return res.status(500).send('An error ocurred', err);
        } else {
            // If it worked, Delete the original images.
            fs.unlink(path.join(path.dirname(process.mainModule.filename) + '/images/' + image.filename), (err) => {
                if (err) {
                    console.error(err)
                    return res.status(500).send('An error occurred', err);
                }
            });

            // Then return to the admin page.
            return res.redirect('/admin');  
        }
    });
};

// GET /admin/edit-image/:id
// The function delievers the update image data view.
exports.getEditImage = (req, res, next) => {
    // Get the id from the URL.
    const imageId = req.params.id;

    // Get the image information to be edited.
    MetaPic.findById(imageId)
        .lean()
        .select("object date location telescope comments")
        .then(image => {
            // Render the edit image page.
            return res.render('edit-image.html', {
                title: 'Edit Image - ' + image.object,
                path: '/home',
                object: image.object,
                date: image.date,
                location: image.location,
                telescope: image.telescope,
                comments: image.comments,
                id: image._id,
            });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// POST /admin/edit-image
// The function updates the data for an image.
exports.postEditImage = (req, res, next) => {
    // Get the data from the form.
    const object = req.body.object;
    const date = req.body.date;
    const location = req.body.location;
    const telescope = req.body.telescope;
    const comments = req.body.comments;
    const imageId = req.body.imageId;
    const errors = validationResult(req);

    // Validate the input.
    if (imageId == '' || object == '' || date == '' || location == '' || telescope == '' || comments == '' || !errors.isEmpty()) {
        // Return to the edit image page.
        return res.status(422).render('add-image.html', {
            title: 'Edit Image - ' + object,
            path: '/home',
            object: object,
            date: date,
            location: location,
            telescope: telescope,
            comments: comments,
            id: imageId,
            errorMessage: 'Please fill out all the form elements'
        });
    };

    // If passed, update the data for the image.
    return MetaPic.findByIdAndUpdate({_id: imageId}, {
        object: object,
        date: date,
        location: location,
        telescope: telescope,
        comments: comments,
    }, (err) => {
        // if there was an error.
        if (err) {
            console.log(err);
            res.status(500).send('An error ocurred', err);
        } else {
            // If everything worked, redirect to the admin page.
            res.redirect('/admin');
        }
    });
};

// GET /admin/delete-image/:id
// The function returns the delete image page.
exports.getDeleteImage = (req, res, next) => {
    // Get the id from the URL.
    const imageId = req.params.id;

    // Find the image from the database.
    MetaPic.findOne({ _id: imageId })
        .lean()
        .select("object date")
        .then(image => {
            return res.render('delete-image.html', {
                'title': 'Delete Image - ' + image.object,
                'path': '/home',
                'id': image._id,
                'object': image.object,
                'date': image.date,
            });
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// POST /admin/delete-image/:id
exports.postDeleteImage = (req, res, next) => {
    // Get the id from the URL.
    const imageId = req.params.id;

    // Delete the image from the database.
    return MetaPic.deleteOne({ _id: imageId }, (err) => {
        // If there was an error, throw an error with 500 error code.
        if (err) {
            console.log(err);
            res.status(500).send('An error ocurred', err);
        } else {
            // If not, redirect to the admin page.
            res.redirect('/admin');
        }
    });
};

// GET /admin/reset-password
exports.getResetPassword = (req, res, next) => {
    return res.render('reset-password.html', {
        title: 'Reset Passord',
        path: '/home',
    });
};

// POST /admin/reset-password
exports.postResetPassword = (req, res, next) => {
    // Get the data from the form.
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    const errors = validationResult(req);

    // Validate the data.
    if (password == '' || cpassword == '' || password != cpassword || !errors.isEmpty()) {
        // If it fails, return to the page again.
        return res.status(422).render('reset-password.html', {
            title: 'Reset Password',
            path: '/home',
        });
    }

    // If validation passed, update the password.
    return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            Users.findOneAndUpdate({username: 'Testuser'}, {password: hashedPassword}, (err) => {
                // If there was an error, throw an error with 500 error code.
                if (err) {
                    console.log(err);
                    res.status(500).send('An error ocurred', err);
                }
                // If not, render the homepage with one item.
                else {
                    res.redirect('/admin');
                }
            });
        });
};

// GET /admin
// The function delievers the admin page to the admin.
exports.getAdmin = (req, res, next) => {
    // Get all the images.
    return MetaPic.find()
        .lean()
        .sort('-date')
        .select("object date")
        .then(images => {
            // Render the admin page.
            res.render('admin.html', {
                'title': 'Admin',
                'path': '/home',
                'images': images,
            }); 
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};