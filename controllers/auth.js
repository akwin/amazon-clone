const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        docTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("5e866105ece04cccae41332a")
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        //console.log('save session err', err);
        res.redirect('/'); //do this in scenarios you want to be sure that the session was created
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log('err', err);
        res.redirect('/');
    });
};