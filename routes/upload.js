var express = require('express');
var router = express.Router();
var fs = require('fs');
var Data = require('../data.js');


// Adds a track. It does not overwrite in case an existing track with same name exists
//To modify a track, the user has to delete the track and re-upload it.
router.post('/', function(req, res, next) {


  try {

    var fileData = fs.readFileSync(req.file.path, 'ascii'); //could have used a promise
    db = new Data();
    db.fileToJson(fileData).then(function(content) {
                              return Promise.all([content, db.addTrack(content)]);
                                }).then(function (results) {
                                  res.send("Uploaded <br> " + JSON.stringify(results));
                                  // res.render('display', { trackData: results })
                                })
                                .catch(function(e) {
                                  console.error(e);
                                  res.send("Could not upload file, please check if track name already exists or if file format is correct " + e);
                                });
    

  }

  catch (ex) {
    res.send(ex);
  }
  finally {
    fs.unlink(req.file.path,  function(err)  {
      if (err) {
        throw err;
      }
      else {
        console.log("file deleted " + req.file.path);
      }
    });
  };

});

module.exports = router;
