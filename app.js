// this will load .env file which is default dev mode
require('custom-env').env('process'); 

// Import the needed Libraries.
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const csrf = require('csurf');
const flash = require('connect-flash');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const nunjucks = require('nunjucks');

// Import the error controller
const errorController = require('./controllers/error');

// Import the routes.
const siteRoutes = require('./routes/site');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

// Import the needed models
const User = require('./models/user');

// Create the web app.
const app = express();
const PORT = process.env.PORT || 5000
const MONGODB_URL = process.env.MONGODB_URL;

// Setup the sessions.
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions'
});

// Create the csrf protection.
const csrfProtection = csrf();

// Create the fileStorage.
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Set render engine.
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('view engine', 'html');

// Make the public folder open.
app.use(express.static(path.join(__dirname, 'public')));

// Use the encoders.
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage}).single('image'));

// Create the session for the user.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

// Add csrf protection
app.use(csrfProtection);
app.use(flash());

// Check if the user has a session.
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// Autenticate the user.
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Get the current user.
app.use((req, res, next) => {
  User.findOne()
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

// Follow the routing for the web app.
app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(siteRoutes);

// Deliver the 500 page if the user is not authorized.
app.use('/500', errorController.get500);

// Deliver the 404 page if no other options work.
app.use(errorController.get404);

// Deliver the 500 page if there was an error.
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render('500.html', {
    title: 'Error has Occured',
    path: '/home'
  });
});

// Have the app listen on current port.
mongoose
  .connect(
    MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(result => {
    // This should be your user handling code implement following the course videos
    app.listen(PORT);
    console.log('Listening on port ' + PORT);
  })
  .catch(err => {
    console.log(err);
  });