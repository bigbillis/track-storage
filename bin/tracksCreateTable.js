var AWS = require("aws-sdk");


AWS.config.loadFromPath('../config.json');

var dynamodb = new AWS.DynamoDB();

/*
var params = {
    TableName : "Tracks"
};

dynamodb.deleteTable(params, function(err, data) {
    if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

*/
var params = {
    TableName : "Tracks",
    KeySchema: [
        { AttributeName: "track_name", KeyType: "HASH"}

    ],
    AttributeDefinitions: [
        { AttributeName: "track_name", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});