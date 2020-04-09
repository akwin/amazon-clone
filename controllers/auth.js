const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const apiKey = require('../apiKey');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
      api_key: apiKey
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length >0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        docTitle: 'Login',
        errorMessage: message
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length >0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      docTitle: 'Signup',
      errorMessage: message
    });
  };
  
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password!');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
            .then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    return req.session.save((err) => {
                        console.log('save session err', err);
                        res.redirect('/');  //do this in scenarios you want to be sure that the session was created
                    });
                }
                req.flash('error', 'Invalid email or password!');
                res.redirect('/login');
            })
            .catch(err => {
                console.log(err);
                res.redirect('/login');
            });
            })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email already exists!');
                return res.redirect('/signup');
            }
        return bcrypt
            .hash(password, 12)
            .then(hashedPassword => {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: {items: []}
                });
                return user.save();
            })
            .then(result => {
                res.redirect('/login');
                return transporter.sendMail({
                    to: email,
                    from: 'dolphin.ak324@gmail.com',
                    subject: 'Welcome to your Shop!',
                    html: '<h1>You successfully signed up to the shop!'
                });
            }).catch(err => {
                console.log(err);
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log('err', err);
        res.redirect('/');
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset-password', {
        path: '/reset-password',
        docTitle: 'Reset Password',
        errorMessage: message
      });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                req.flash('error', 'The user with this email does not exist');
                return res.redirect('/reset-password');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(result => {
            res.redirect('/');
            transporter.sendMail({
                to: req.body.email,
                from: 'dolphin.ak324@gmail.com',
                subject: 'Reset your password',
                html: `
                    <p>You requested to reset your password</p>
                    <p>Click this <a href="http://localhost:3000/reset-password/${token}"link</a> to reset now!</p>
                `
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne(
        {resetToken: token, 
        resetTokenExpiration: {$gt: Date.now()}}
    ).then(user => {
        let message = req.flash('error');
        if (message.length >0) {
            message = message[0];
        } else {
            message = null;
        }
        res.render('auth/new-password', {
        path: '/new-password',
        docTitle: 'Set New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
        });
    })
     .catch(err => {
        console.log(err);
     });
};


exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne(
        {resetToken: passwordToken, 
        resetTokenExpiration: {$gt: Date.now()},
        _id: userId
    }).then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => {
        console.log(err);
    })
};
