var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "index.ejs";
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');


var task = function(request, callback){
	//1. load configuration
	var awsConfig = helpers.readJSONFile(AWS_CONFIG_FILE);
	var policyData = helpers.readJSONFile(POLICY_FILE);
	var hiddenFields = [];
	var files = ["sd", "ds"];

	var s3 = new AWS.S3();

	//2. prepare policy
	var policy = new Policy(policyData);

	//3. generate form fields for S3 POST
	var s3Form = new S3Form(policy);
	//4. get bucket name

	var bucket = policy.getConditionValueByKey("bucket");

	
    policy.getConditions().push({ "x-amz-meta-uploader": request.connection.remoteAddress });
	hiddenFields = s3Form.generateS3FormFields();
    hiddenFields = s3Form.addS3CredientalsFields(hiddenFields, awsConfig);

	var params = {
	Bucket: bucket, /* required */
	Prefix: "zaworski/"
	};
	s3.listObjects(params, function(err, data) {
	if (err) {
		console.log(err, err.stack); // an error occurred

				callback(null, {template: INDEX_TEMPLATE, params:{
		fields:hiddenFields, bucket:bucket, files:[{Key: "Error"}]
		}});
	}
	else {
		console.log("--------------------------------------------------------------------------------------------------");
		console.log(data);           // successful response
		files = data.Contents;

		callback(null, {template: INDEX_TEMPLATE, params:{
		fields:hiddenFields, bucket:bucket, files:files
		}});
	}
	});

}

exports.action = task;
