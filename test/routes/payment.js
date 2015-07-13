var request = require('supertest');

describe('loading express', function () {

	var server;

  	beforeEach(function () {
    	server = require('../../server');
  	});

  	afterEach(function () {
    	server.close();
  	});

  	var data = {
        cardNumber : "4012888888881881",
        cardType : "visa",
        cardCVV : 874,
        cardExpMonth : 10,
        cardExpYear : 2015,
        cardFirstName : "Mustafa",
        cardLastName : "Kara",
        orderCurrency : "HKD",
        orderTotal : "5.00",
        orderFullName : "Cafer Kara"
    };

   
   	it("returns 200 status (Makes a payment)", function(done) {
    	request(server)
    	.post("/order/payment")
    	.send(data)
    	.expect(200)
    	.end(function(err, res) {
    		if (err) return done(err);
        	done()
    	});
    });

});