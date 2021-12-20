// The middleware redirects the user to login page if not logged in.
module.exports = (req, res, next) => {
    // Check to see if the user is logged in.
    if (!req.session.isLoggedIn) {
        // If not, redirect the user to the login page.
        return res.redirect('/login');
    }

    // Move to the next middleware.
    next();
};