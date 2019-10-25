

Parse.Cloud.define("getTable", async (request) => {
	// Set up to modify user data
	Parse.Cloud.useMasterKey();
	
});

Parse.Cloud.define("getObjectById", async (request) => {
	// Set up to modify user data
	Parse.Cloud.useMasterKey();
	const query = new Parse.Query(request.params.tableName);
	query.equalTo("objectId", request.params.objectId);
	const results = await query.first();
	console.log(results);
	return results;
	// var base64 = "V29ya2luZyBhdCBQYXJzZSBpcyBncmVhdCE=";
	// var parseFile = new Parse.File("myfile.txt", { base64: base64 }, 'text/plain');
	// parseFile.save().then(function() {
	// 	response.success(parseFile.url());
	// }, function(error) {
	// 	response.error(parseFile.url());
	// // The file either could not be read, or could not be saved to Parse.
	// });
});

Parse.Cloud.define("getObjects", async function(request, response) {
	// Set up to modify user data
	Parse.Cloud.useMasterKey();
	
	parseFile.save().then(function() {
		response.success(parseFile.url());
	}, function(error) {
		response.error(parseFile.url());
	// The file either could not be read, or could not be saved to Parse.
	});
});