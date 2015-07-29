var fs = require('fs');

try{
    // Database configurations
    var configDbJson = fs.readFileSync(__dirname + "/config.json");
    var configDb = JSON.parse(configDbJson.toString());

} catch(error){
    console.error("config.json not found or not valid: " + error.message);
    process.exit(1);
}

var mongodb = require('mongodb');
var mongoServer = new mongodb.Server(
    configDb.host, configDb.port, { auto_reconnect:true }
);

var mongo = new mongodb.Db(configDb.db, mongoServer, {safe:false});
var mongoConnected = false;

exports.open = function(callback){
  exports.openMongo(function () {
    callback();
  });
};

exports.openMongo = function (callback) {
  if(mongoConnected){callback(); return;}

  if(mongo.openCalled) return;

  mongo.open(function(error, db){
    if(error) throw error;
    mongoConnected = true;
    mongo.authenticate(configDb.user, configDb.password, function(error, result){
      callback(result);
    });
  });
};

exports.mongo = mongo;
