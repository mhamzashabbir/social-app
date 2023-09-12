const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uuid = require('uuid');
const multer = require('multer');


const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const app = express();

const fileStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'images');
    },
    filename : (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'){
            cb(null, true);
        }
    else{
        cb(null, false);
    }
}

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json 

app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter
}).single('image') // image is the name of the field in the request body
); 

app.use('/images', express.static(path.join(__dirname, 'images'))); // Serve images statically


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow access to any client
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // Allow these methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow these headers
    next();
})

app.use('/feed', feedRoutes); // => /feed/posts
app.use('/auth', authRoutes);

app.use((error , req , res , next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status)
        .json({
            message : message,
            data : data
        })
})

mongoose.connect('mongodb+srv://muhammadhamzapro007:Games321@cluster0.efskmfu.mongodb.net/messages?retryWrites=true&w=majority')
    .then(
        console.log('Connected to MongoDB'),
        app.listen(8080)
    )
    .catch(err => console.log(err));