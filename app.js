const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop')

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes); //adminData refers to all the exports in admin.js file
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('error', {docTitle:'Page Not Found'});
});

app.listen(3000);