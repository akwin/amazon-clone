//const http = require('http');

const express = require('express');

const app = express();

app.use('/add-product', (req, res, next) => {
    console.log('In another middleware!');
    res.send('<h1>This is the page to Add Products!</h1>');
});

app.use('/',  (req, res, next) => {
    console.log('In another middleware!');
    res.send('<h1>Hello from Express!</h1>');
});

//const server = http.createServer(app);

//server.listen(3000);

app.listen(3000);

