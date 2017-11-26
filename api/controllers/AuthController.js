/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  pin: function (req, res) {
    const user = req.session.preAuthUser;

    res.view('pin', {user: user})
  },

  logout: function (req, res) {
    delete req.session.user;
    res.redirect('/');
  }
};

