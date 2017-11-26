/**
 * ProfileController
 *
 * @description :: Server-side logic for managing Profiles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



module.exports = {
	profile: function (req, res){

		User.findOne(1).exec((err, user) => {
			if (err || !user) {
				return res.badRequest();
			}
			res.view('profile', {user: user})
		})
	}
};

