var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

//CREATE
router.route('/create')
  .get(function(req, res) {
    res.render('create', { title: 'Audio Library' });
  })
  .post(function(req, res) {
  	var title = req.body.title;
  	var artist = req.body.artist;
  	var duration = req.body.duration;
  	var codec = req.body.codec;

  	mongoose.model('Audiofile').create({
  	  title : title,
  	  artist : artist,
  	  duration : duration,
  	  codec : codec
  	}, function (err, audiofileID) {
      if (err) {
        res.send("Create Error: " + err);
      }
      else {
        res.format({
          html: function(){
            res.redirect("/");
          },
          json: function(){
            res.json(audiofile);
          }
        });
      }
    });
  })

//READ
router.route('/')
  .get(function(req, res, next) {
    mongoose.model('Audiofile').find({}, function (err, audiofiles) {
      if (err) {
        return console.error(err);
      } else {
        res.format({
          html: function(){
            res.render('index', {
              title: 'Audio Library',
              "audiofiles" : audiofiles
            });
          },
          json: function(){
            res.json(audiofiles);
          }
        });
      }
    });
  })

router.param('id', function(req, res, next, id) {
  mongoose.model('Audiofile').findById(id, function (err, audiofile) {
    if (err) {
      console.log(err);
      res.format({
        html: function(){
          next(err);
        },
        json: function(){
          res.json({message : err.status  + ' ' + err});
        }
      });
    } else {
      console.log(audiofile);
      req.id = id;
      next();
    }
  });
});

//UPDATE
router.route('/:id/update')
	.get(function(req, res) {
	  mongoose.model('Audiofile').findById(req.id, function (err, audiofile) {
	    if (err) {
	      res.send("Update Error: " + err);
	    } else {
	      res.format({
	        html: function(){
            res.render('update', {
              title: 'Audio Library',
              "audiofile" : audiofile
            });
          },
	        json: function(){
	          res.json(audiofile);
	        }
	      });
	    }
	  });
	})
	.post(function(req, res) {
	  var title = req.body.title;
	  var artist = req.body.artist;
	  var duration = req.body.duration;
	  var codec = req.body.codec;

	  mongoose.model('Audiofile').findById(req.id, function (err, audiofile) {
	    audiofile.update({
	      title : title,
	      artist : artist,
	      duration : duration,
	      codec : codec
	    }, function (err, audiofileID) {
        if (err) {
          res.send("Update Error: " + err);
        }
        else {
          res.format({
            html: function(){
              res.redirect("/");
            },
            json: function(){
              res.json(audiofile);
            }
          });
        }
      })
    });
  })

//DELETE
router.route('/:id/delete')
	.get(function(req, res) {
	  mongoose.model('Audiofile').findById(req.id, function (err, audiofile) {
      if (err) {
        res.send("Delete Error: " + err);
      }
      else {
        audiofile.remove(function (err, audiofile) {
          if (err) {
            res.send("Delete Error: " + err);
          }
          else {
	          res.format({
	            html: function(){
	               res.redirect("/");
	            },
	            json: function(){
	              res.json({
                  message : 'deleted',
  	              item : audiofile
	              });
	            }
	          });
	        }
	      });
	    }
	  });
	})

//POPULATE DATABASE
router.route('/populate')
  .get(function(req, res) {

    var ffprobe = require('ffprobe');
    var ffprobeStatic = require('ffprobe-static');
    const fs = require('fs');
    const audioFolder = './audio/';

    fs.readdir(audioFolder, (err, files) => {
      files.forEach((file, i, files) => {

        ffprobe(audioFolder + file, { path: ffprobeStatic.path })
          .then(function (info) {
          	var title = file;
          	var artist = '';
          	var duration = info.streams[0].duration;
          	var codec = info.streams[0].codec_name;

          	mongoose.model('Audiofile').create({
          	  title : title,
          	  artist : artist,
          	  duration : duration,
          	  codec : codec
          	}, function (err, audiofileID) {
              if (err) {
                res.send("Populate Error: " + err);
              }
              else {
                if(i==files.length-1){
                  res.redirect("/");
                }
              }
            });
        })
        .catch(function (err) {
          console.error(err);
        })
      });
    });
  })

module.exports = router;
