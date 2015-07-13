var storage = require("./db/storage");

exports.save = function(query, callback){

	storage.open(function() {
		storage.mongo.collection("payment", function(error, collection){
        	if(error)return callback(error, false);
        	collection.insert(query, function(error, saved){
            	if(error || !saved) return callback(error, false);
            	callback(null, true);
        	});
    	});
	});
}