const pool = require('../database');

module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    },

   

    isLoggedInAdmin (req, res, next) {
        if (req.isAuthenticated() && req.user.correo_usuario == 'cartama@10.com') {
            return next();
        }
        return res.redirect('/signin');
    }

};
