
var AWS = require('aws-sdk');

var task = function(request, callback){
    
    var files = request.body.files ? request.body.files : "missing parameter: files";

    var sqs = new AWS.SQS();

    var params = {
        MessageBody: 'Files to process', /* required */
        QueueUrl: 'https://sqs.us-west-2.amazonaws.com/983680736795/zaworskiSQS', /* required */
        DelaySeconds: 0,
        MessageAttributes: {
        "FileKeys": {
            DataType: "String", 
            StringValue: files
            }
        }
    };

        sqs.sendMessage(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        });


    callback(null, null);
}

exports.action = task;