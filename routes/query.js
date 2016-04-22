var express = require('express');
var router = express.Router();
var Data = require('../data.js');

//return all the tracks
router.get('/getAll', function(req, res, next) {

  db = new Data();
  db.getAllTracks().then(function (content) {
                    res.render('display', { trackData: content })
                    })
                   .catch(function(e) {
                    console.error(e);
                     res.send("Internal Error ");
                    });
});

//delete a track
router.get('/removeTrack', function(req, res, next) {

  //check if the requested track exists and then remove it
  var tName = req.query.trackName || ' ';
  db = new Data();
  db.searchName(tName).then(function(content) {
                        if(content.Count) {
                          return Promise.all([content, db.removeTrack(tName)]);
                        } else {
                          res.send("Track not found");
                        }
                      }).then(function (results) {
                            res.send(tName + " was successfully deleted ");
                          })
                          .catch(function(e) {
                            res.send("Internal Error ");
                          });

});

//search for tracks that contain a position
router.get('/search', function(req, res, next) {

 //if is undefined then it will not bring results; we suppose there is no latitude and longitude with value 999
   var reqLon = parseFloat(req.query.lon) || 999;
   var reqLat = parseFloat(req.query.lat) || 999;

  console.log(reqLat);
  db = new Data();
  db.searchPosition(reqLon, reqLat).then(function (content) {
                                       if(content.Count)
                                         res.render('display', { trackData: content })
                                       else
                                         res.send("No data found");
                                     })
                                     .catch(function(e) {
                                       console.error(e);
                                     });
});

//search for tracks by name
router.get('/getTrack', function(req, res, next) {

  console.log("name param is " + req.query.trackName );
  var reqName = req.query.trackName || ' ' ;

  db = new Data();
  db.searchName(reqName).then(function (content) {

                               if(content.Count)
                                 res.render('track', {trackData: content})
                               else
                                 res.send("No data found");
                                    })
                                    .catch(function(e) {
                                      console.error(e);
                                     });

});

module.exports = router;