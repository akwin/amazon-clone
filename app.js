const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
//const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error');
const db = require('./util/database');

const app = express();

//app.engine('handlebars', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout'}));
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes); //adminData refers to all the exports in admin.js file
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);