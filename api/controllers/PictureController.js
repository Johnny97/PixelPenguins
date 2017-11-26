/**
 * PicturesController
 *
 * @description :: Server-side logic for managing Pictures
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  upload: function (req, res) {
    req.file('files').upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 100000000
    }, function (err, uploadedFiles) {

      if (err) {
        return res.negotiate(err);
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0) {
        return res.redirect('/profile');
      }

      let images = [];

      uploadedFiles.forEach((picture) => {
        images.push({
          user: req.session.user.id,
          fileFd: picture.fd
        })
      });

      // Save the "fd" and the url where the avatar for a user can be accessed
      Picture.create(images).exec(function (err, pictures) {
        if (err) return res.negotiate(err);

        res.redirect('/profile')
      });
    });
  },
  retrieve: function (req, res) {
    Picture.findOne(req.param('id')).exec(function (err, picture){
      if (err) return res.negotiate(err);
      if (!picture) return res.notFound();

      // User has no avatar image uploaded.
      // (should have never have hit this endpoint and used the default image)
      if (!picture.fileFd) {
        return res.notFound();
      }

      var SkipperDisk = require('skipper-disk');
      var fileAdapter = SkipperDisk(/* optional opts */);

      // Stream the file down
      fileAdapter.read(picture.fileFd)
        .on('error', function (err){
          return res.serverError(err);
        })
        .pipe(res);
    });
  }
};

