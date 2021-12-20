// Import the needed libraries.
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Import the products model.
// const Products = require('../models/products');
const Users = require('../models/user');

// GET /admin/add-image
exports.getAddProduct = (req, res, next) => {
    // Render the add image view
    return res.render('add-image.html', {
        title: 'Add Image',
        path: '/home'
    });
};

// // POST /admin/add-products
// exports.postAddProduct = (req, res, next) => {
//     // Get the data from the form.
//     const name = req.body.name;
//     const price = req.body.price;
//     const options = req.body.options;
//     const description = req.body.description;
//     const url = req.body.url;
//     const image = req.file;
//     const errors = validationResult(req);

//     // Validate the input.
//     if (!image || name == '' || url == '' || price == '' || options == '' || description == '' || !errors.isEmpty()) {
//         return res.status(422).render('add-product.html', {
//             title: 'Add Product',
//             path: '/home',
//             productTitle: name,
//             price: price,
//             options: options,
//             description: description,
//             url: url,
//         });
//     }

//     // Resized the image using sharp.
//     sharp(path.join(path.dirname(process.mainModule.filename) + '/images/' + image.filename))
//         .resize({
//             fit: sharp.fit.contain,
//             width: 800
//         })
//         .toFormat("jpeg")
//         .jpeg({
//             quality: 80
//         })
//         .toFile(path.join(path.dirname(process.mainModule.filename) + '/images/temp.jpg'))
//         .then(() => {
//             // Create the object for the product.
//             var obj = {
//                 title: name,
//                 description: description,
//                 options: options,
//                 price: price,
//                 date: Date.now(),
//                 url: url,
//                 img: {
//                     data: fs.readFileSync(path.join(path.dirname(process.mainModule.filename) + '/images/temp.jpg')),
//                     contentType: image.mimetype
//                 }
//             };

//             // Save the product to the database.
//             Products.create(obj, (err) => {
//                 // If there was an error.
//                 if (err) {
//                     console.log(err);
//                     res.status(500).send('An error ocurred', err);
//                 } else {
//                     // Delete the original images.
//                     fs.unlink(path.join(path.dirname(process.mainModule.filename) + '/images/' + image.filename), (err) => {
//                         if (err) {
//                             console.error(err)
//                             res.status(500).send('An error occurred', err);
//                         }
//                     });

//                     // Delete the resized image.
//                     fs.unlink(path.join(path.dirname(process.mainModule.filename) + '/images/temp.jpg'), (err) => {
//                         if (err) {
//                             console.error(err)
//                             res.status(500).send('An error occurred', err);
//                         }
//                     });

//                     // redirect to the admin page.
//                     return res.redirect('/admin');
//                 }
//             });
//         })
//         .catch((err) => {
//             // If there was an error.
//             if (err) {
//                 console.log(err);
//                 return res.status(500).send('An error ocurred', err);
//             }
//         });
// };

// // GET /admin/edit-product/:id
// exports.getEditProduct = (req, res, next) => {
//     // Get the id from the URL.
//     const productId = req.params.id;

//     // Get the product information to be edited.
//     return Products.findOne({_id: productId}, (err, product) => {
//         // If there was an error, redirect to the 500 page.
//         if (err) {
//             console.log(err);
//             res.status(500).send('An error occurred', err);
//         }
//         // If not, deliever the edit product view page.
//         else {
//             res.render('edit-product.html', {
//                 'title': 'Update ' + product['title'],
//                 'path': '/home',
//                 'productTitle': product['title'],
//                 'price': product['price'],
//                 'options': product['options'],
//                 'description': product['description'],
//                 'id': productId,
//                 'url': product['url'],
//             });
//         }
//     });
// };

// // POST /admin/edit-product/:id
// exports.postEditProduct = (req, res, next) => {
//     // Get the data from the form.
//     const name = req.body.name;
//     const price = req.body.price;
//     const options = req.body.options;
//     const description = req.body.description;
//     const url = req.body.url;
//     const image = req.file;
//     const errors = validationResult(req);

//     // Get the id from the URL.
//     const productId = req.params.id;

//     // Validate the input.
//     if (!image || name == '' || url == '' || price == '' || options == '' || description == '' || !errors.isEmpty()) {
//         return res.status(422).render('edit-product.html', {
//             title: 'Update ' + name,
//             path: '/home',
//             productTitle: name,
//             price: price,
//             options: options,
//             description: description,
//             id: productId,
//             url: url,
//         });
//     }

//     // Resized the image using sharp.
//     sharp(path.join(path.dirname(process.mainModule.filename) + '/images/' + image.filename))
//         .resize({
//             fit: sharp.fit.contain,
//             width: 800
//         })
//         .toFormat("jpeg")
//         .jpeg({
//             quality: 80
//         })
//         .toFile(path.join(path.dirname(process.mainModule.filename) + '/images/temp.jpg'))
//         .then(() => {
//             // Save the product to the database.
//             Products.findByIdAndUpdate({_id: productId}, {
//                 title: name,
//                 description: description,
//                 options: options,
//                 price: price,
//                 date: Date.now(),
//                 url: url,
//                 img: {
//                     data: fs.readFileSync(path.join(path.dirname(process.mainModule.filename) + '/images/temp.jpg')),
//                     contentType: image.mimetype
//                 }
//             }, (err) => {
//                 // If there was an error.
//                 if (err) {
//                     console.log(err);
//                     res.status(500).send('An error ocurred', err);
//                 } else {
//                     // Delete the original images.
//                     fs.unlink(path.join(path.dirname(process.mainModule.filename) + '/images/' + image.filename), (err) => {
//                         if (err) {
//                             console.error(err)
//                             res.status(500).send('An error occurred', err);
//                         }
//                     });

//                     // Delete the resized image.
//                     fs.unlink(path.join(path.dirname(process.mainModule.filename) + '/images/temp.jpg'), (err) => {
//                         if (err) {
//                             console.error(err)
//                             res.status(500).send('An error occurred', err);
//                         }
//                     });

//                     // Redirect to the admin page.
//                     return res.redirect('/admin');
//                 }
//             });
//         })
//         .catch((err) => {
//             // If there was an error.
//             if (err) {
//                 console.log(err);
//                 return res.status(500).send('An error ocurred', err);
//             }
//         });
// };

// // GET /admin/delete-product/:id
// exports.getDeleteProduct = (req, res, next) => {
//     // Get the id from the URL.
//     const productId = req.params.id;

//     // Find the product from the database.
//     return Products.findOne({_id: productId}, (err, product) => {
//         // If there was an error, redirect to the 500 page.
//         if (err) {
//             console.log(err);
//             res.status(500).send('An error occurred', err);
//         }
//         // If not, deliever the product view page.
//         else {
//             // Render the delete product view.
//             return res.render('delete-product.html', {
//                 'title': 'Delete ' + product['title'],
//                 'path': '/home',
//                 'id': productId,
//                 'productTitle': product['title'],
//             });
//         }
//     });
// };

// // POST /admin/delete-product/:id
// exports.postDeleteProduct = (req, res, next) => {
//     // Get the id from the URL.
//     const productId = req.params.id;

//     // Delete the product from the database.
//     return Products.deleteOne({_id: productId}, (err) => {
//         // If there was an error, throw an error with 500 error code.
//         if (err) {
//             console.log(err);
//             res.status(500).send('An error ocurred', err);
//         }
//         // If not, render the homepage with one item.
//         else {
//             res.redirect('/admin');
//         }
//     });
// };

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
    // Get all the products.
    res.render('admin.html', {
        'title': 'Admin',
        'path': '/home',
    });
};