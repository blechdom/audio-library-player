var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        return method
      }
}))

//CREATE
router.route('/create')
  .get(function(req, res) {
    res.render('create', { title: 'Create' });
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
  //POST NEW
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
    }, function (err, audiofile) {
      if (err) {
        res.send(err);
      } else {
        console.log('POST NEW: ' + audiofile);
        res.format({
          html: function(){
            res.location("audiofiles");
            res.redirect("/");
          },
          json: function(){
            res.json(audiofile);
          }
        });
      }
    })
  });

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
//GET BY ID TO EDIT
router.route('/:id/update')
	.get(function(req, res) {
	  mongoose.model('Audiofile').findById(req.id, function (err, audiofile) {
	    if (err) {
	      console.log(err);
	    } else {
	      console.log('GET: ' + audiofile._id);
	      res.format({
	        html: function(){
            res.render('update', {
              title: 'Audiofile' + audiofile._id,
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
	//PUT UPDATE BY ID
	.put(function(req, res) {
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
        res.send("There was a problem updating the information to the database: " + err);
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

router.route('/:id/delete')
	.get(function(req, res) {
	  mongoose.model('Audiofile').findById(req.id, function (err, audiofile) {
      if (err) {
        return console.error(err);
      } else {
        audiofile.remove(function (err, audiofile) {
          if (err) {
              return console.error(err);
          } else {
	          console.log('DELETE removing ID: ' + audiofile._id);
	          res.format({
	            html: function(){
	               res.redirect("/");
	          },
	          json: function(){
	            res.json({message : 'deleted',
  	            item : audiofile
	            });
	          }
	        });
	      }
	    });
	  }
	});
	})

module.exports = router;
