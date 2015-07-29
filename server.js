var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set("view engine", "ejs");
app.use("/order", require("./routes/payment"));
app.get('/payment', function(req, res){
  res.render('index.ejs');
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    "succeed" : false,
  	"msg" : err.message
  });
});

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});

module.exports = server;
