const jwt = require('../../utils/jwt');
const {cookie} = require('../../config/config');
const User = require('./User');

module.exports = {
    get: {
        login(req, res, next) {
            res.render('users/login.hbs')
        },

        register(req, res, next) {
            res.render('users/register.hbs');
        },

        logout(req, res, next){
            req.user = null,
            res.clearCookie(cookie).redirect('/users/login')
            console.log('User logged out')
        }
    },

    post: {
        login(req, res, next) {
            const {email, password} = req.body;

            User.findOne({email})
            .then((user)=> {
                return Promise.all([user.passwordsMatch(password), user])
            }).then(([match, user])=> {
                if (!match) {
                    next(err);
                    return;
                }

                const token = jwt.createToken(user);

                res
                .status(201)
                .cookie(cookie, token, {maxAge: 3600000})
                .redirect('/home/');
            })
            
        },

        register(req, res, next) {
            const {email, fullName, password, repeatPassword } = req.body;

            if(password !== repeatPassword){
                res.render('users/register.hbs', {
                    message: "Passwords do not match!",
                    oldInput: {email, fullName, password, repeatPassword}
                });
                return;
            }

            User.findOne({ email})
            .then((currentUser)=> {
                if (currentUser) {throw new Error('The given email is already used!')}
                return User.create({email, fullName, password, repeatPassword})
            }).then((createdUser)=> {
                res.redirect('/users/login');               
            }).catch((err)=> {
                res.render('users/register.hbs', {
                    message: err.message,
                    oldInput: {email, fullName, password, repeatPassword}
                });
            });

            // User.create({
            //         email,
            //         fullName,
            //         password,
            //         repeatPassword
            //     })
            //     .then((createdUser) => {
            //         res.redirect('/home/');
            //     });
        }
    }
}