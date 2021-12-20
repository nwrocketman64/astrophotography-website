// Import the needed libraries.
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

// Import the models
const Users = require('../models/user');

// GET /login
// The function delievers the login view.
exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('login.html', {
        path: '/login',
        title: 'Login',
        errorMessage: message,
        email: ''
    });
};

// POST /login
// The function logins in a user.
exports.postLogin = (req, res, next) => {
    // Get the user input from the form.
    const email = req.body.username;
    const password = req.body.password;
    const errors = validationResult(req);

    // Validate the inputs.
    if (email == '' || password == '' || !errors.isEmpty()) {
        return res.status(422).render('login.html', {
            path: '/login',
            title: 'Login',
            errorMessage: 'Please fill out all the forms',
            email: email
        });
    }

    // If the input is valid, start the login process.
    Users.findOne()
        .lean()
        .then(user => {
            // Check to see if the username is correct.
            if (user.username == email) {
                // If so, then check to see if the password is correct.
                bcrypt
                    // Compare the hashed passwords.
                    .compare(password, user.password)
                    .then(doMatch => {
                        // If the passwords match.
                        if (doMatch) {
                            // Login the user in the sessions
                            req.session.isLoggedIn = true;
                            req.session.user = user;

                            // Save the session and redirect to admin.
                            return req.session.save(err => {
                                res.redirect('/admin');
                            });
                        } else {
                            // If the passwords don't match, redirect to login.
                            return res.status(422).render('login.html', {
                                path: '/login',
                                title: 'Login',
                                errorMessage: 'Invalid Password',
                                email: email
                            });
                        }
                    });
            } else {
                // If not, redirect to the login page.
                return res.status(422).render('login.html', {
                    path: '/login',
                    title: 'Login',
                    errorMessage: 'Invalid Email',
                    email: email
                });
            }
        })
        .catch(err => {
            // If there was an error, redirect to the 500 page.
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

// POST /logout
// The function logouts the user.
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
};