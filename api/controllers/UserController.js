/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  register: function (req, res) {

    req.validate({
      firstName: 'required',
      lastName: 'required'
    });

    req.file('avatar').upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 100000000
    }, function (err, uploadedFiles) {

      if (err) {
        return res.negotiate(err);
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0) {
        return res.back('No file was uploaded');
      }

      let barCode = 'REFUGEE' + Math.floor(Math.random() * 1000000);

      // Save the "fd" and the url where the avatar for a user can be accessed
      User.create({
        ...req.body,
        barCode: barCode,

        // Grab the first file and use it's `fd` (file descriptor)
        avatarFd: uploadedFiles[0].fd
      }).exec(function (err, user) {
        if (err) return res.negotiate(err);

        res.view('auth/after_register', { user: user });
      });
    });
  }

};

