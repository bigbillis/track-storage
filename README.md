# track-storage
Storage system for GPX files

First you should input your AWS keys in config.json in order to use AWS SDK.
Then you should create a table in DynamoDB with track_name as key.
You shall run once bin/tracksCreateTable.js to create the table.
Install the requeired dependences (npm install)and start bin/www.

Basic Functionality

- Read from GPX files and convert to JSON
- Store GPX informaton in DynamoDB
- Provide CRUD operations to users
