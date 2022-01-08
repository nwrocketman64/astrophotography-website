# Overview
This is the main codebase for the my Astrophotography website. The code here is made open-source
under Apache License 2.0 and you are free to look at the code to either add any suggestments to
improve the code or to copy it and use it as the base template for your website. This website includes features such 
cookie session and image uploads. The website is designed to run through
[Heroku](https://www.heroku.com/).
This website is designed to run on Nodejs version 16.13.1.

# Installing
To install the website for running on your computer, you can clone the codebase either by
using the GitHub website or through git. Once it is on your computer, to get the website
running you must create an .env.process which contains the enviroment variable for
MONOGDB_URL, SESSION_SECRET, GMAIL_USER, and GMAIL_PASS. Once that file, you can install all 
the needed libraries using the npm package manager.
```
npm install
```
Once it is done installing, you can startup the website on your machine using this command.
```
npm start
```

# Development Environment
I used [VS code](https://code.visualstudio.com/) as the main IDE for creating the source 
code. I used a version of node.js which was provided by
[nodesource.com](https://nodesource.com/) for the
[Raspberry Pi Computer](https://www.raspberrypi.org/). I used
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas) as the database.

# Libraries Used
Some of the key libraries that I used for this website include
* Express - The main web framework.
* Express Session - Used to make logging in possible.
* Express Validator - Used to validate and sanitize user inputs.
* Csurf - Provide CSRF protection to the website.
* Bcypt - Used to encrypt passwords and compare hashes.
* Mongoose - The library used to control the MongoDB.
* Multer - Used to process images submitted to the webite.
* Nodemailer - Used in the contact form to send an email to myself.
* Nunjucks - The main templating engine used in the project.
* Nunjucks Date - Provides a date filter for the templating engine.
* Sharp - The library used to process the images when received.

# Useful Websites
These were a few website that I found to be very helpful in building this website
* [Upload and Retrieve Image on MongoDB using Mongoose](https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/)
* [Create Pagination with Node.js, MongoDB, Express and EJS Step by Step from Scratch](https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html)
* [Mongoose Count](https://kb.objectrocket.com/mongo-db/mongoose-count-726)
* [How To Process Images in Node.js With Sharp](https://www.digitalocean.com/community/tutorials/how-to-process-images-in-node-js-with-sharp)
* [Templating](https://mozilla.github.io/nunjucks/templating.html)
* [Node.js Send an Email](https://www.w3schools.com/nodejs/nodejs_email.asp)
* [ExpressJS Tutorial](https://www.tutorialspoint.com/expressjs/index.htm)

# Website Link
This is the link to active website deployed from Heroku.

[Nathan's Astro Images](https://astrophotography.herokuapp.com/)
