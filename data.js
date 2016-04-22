var xml2js = require('xml2js');
var AWS = require("aws-sdk");
var Promise =  require('bluebird');
AWS.config.loadFromPath('./config.json');
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "Tracks";
var Data = null;

Data = function () {
};

//displays name and starting point for all the tracks
Data.prototype.getAllTracks = function() {
    return new Promise(function (resolve, reject) {
    var params = {
        TableName: table
        ,ProjectionExpression: "track_name, lon[0], lat[0]"
    };

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    }
    });
};

//delete a track
Data.prototype.removeTrack = function(item) {
    return new Promise(function (resolve, reject) {
        var params = {
            TableName: table,
            Key:{
                "track_name":item
            }
        };

        docClient.delete(params, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

//search if a given position (lon or lat) exists and return all tracks containing that position
Data.prototype.searchPosition = function(reqLon, reqLat) {
    return new Promise(function (resolve, reject) {

        var params = {
            TableName: table,
            ProjectionExpression: "track_name, lon[0], lat[0]",
            FilterExpression: " (contains(lon, :lon)) OR  (contains(lat, :lat)) ",
            ExpressionAttributeValues: {
                ":lon": reqLon, ":lat": reqLat  }
        };

        docClient.scan(params, onScan);

        function onScan(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        }

    });
};
//search for a track by its name
Data.prototype.searchName = function(reqTrack) {
    return new Promise(function (resolve, reject) {

        var params = {
            TableName: table,
            KeyConditionExpression: "track_name = :nnnn",
            ExpressionAttributeValues: {
                ":nnnn": reqTrack
            }
        };

        docClient.query(params, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });

    });
};

//add a new track from JSON file
Data.prototype.addTrack = function(trackObj) {
    return new Promise(function (resolve, reject) {

        var params = {
            TableName:table,
            Item:{
                "track_name": trackObj.track_name,
                "lat": trackObj.lat,
                "lon": trackObj.lon,
                "time":trackObj.time
            },
            ConditionExpression: "track_name <> :t",
            ExpressionAttributeValues:{
                ":t":trackObj.track_name
            }
        };

        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:");
                reject(err);
            } else {
                console.log("Added item:");
                resolve(data);
            }
        });

    });
};

//convert GPX files to JSON
//we suppose that the file contains the same number of latitude, longitude and time values
Data.prototype.fileToJson = function(fileData) {
    return new Promise(function (resolve, reject) {

            var json = '';
            var parser = new xml2js.Parser();
            parser.parseString(fileData.substring(0, fileData.length), function (error, result) {
                json = result;
            });

        var lon = [], lat = [], time = [];

        for(var i in json.gpx.trk[0].trkseg[0].trkpt) {
            lat[i] = parseFloat(json.gpx.trk[0].trkseg[0].trkpt[i].$.lat);
            lon[i] = parseFloat(json.gpx.trk[0].trkseg[0].trkpt[i].$.lon);
            time[i] = json.gpx.trk[0].trkseg[0].trkpt[i].time;
        }
        var tName = json.gpx.trk[0].name.toString();

        data = {"track_name": tName, "lat": lat, "lon": lon,  "time":time,}
        resolve(data);

    });
};

module.exports = Data;