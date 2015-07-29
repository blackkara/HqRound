var PaymentStorage = require("../models/payment");
var fs = require("fs");

function Payment (paymentData) {
		if(!paymentData){
			var error = new Error("Not found payment data");
			error.status = 500;
			throw error;
		}

		// Do not trust client data and check again our
  	// necessary values, if one of them is not existing,
    // push to array then send user back
    var paramsLack = [];
    Object.keys(paymentData).forEach(function(key) {
    	if(!paymentData[key]){
      	paramsLack.push(key);
      }
    });

    if(paramsLack.length > 0){
    	var values = paramsLack.join(', ');
    	var message = "These value(s) are not found : " + values;
    	var error = new Error(message);
			error.status = 400;
      throw error;
    }

    try{
    	var configPaymentJson = fs.readFileSync(__dirname + "/configurations/payment.json");
    	var configPayment = JSON.parse(configPaymentJson.toString());
    	this.config = configPayment;

    } catch(err){
    	var message = "payment.json not found or not valid: " + err.message;
    	console.error(message);
   		err.message = message;
			err.status = 500;
			throw err;
    }

    this.cardType = this.determineCardType(paymentData.cardNumber);
    this.orderCurrency = this.determineCurrency(paymentData.orderCurrency);
    this.gateway = this.determineGateway(this.cardType, this.orderCurrency);

    paymentData.cardType = this.cardType.toLowerCase();
    this.paymentData = paymentData;
}

Payment.prototype.determineCardType = function(cardNumber) {
		var self = this;
		var cardType;
		Object.keys(self.config.cards.types).forEach(function(key) {
  		var regex = new RegExp(self.config.cards.types[key]);
    	if(regex.test(cardNumber)){
    		cardType = key;
    	}
  	});

  	if(!cardType){
    	var message = "Unknown card type";
    	console.error(message);
    	var error = new Error(message);
    	error.status = 400;
    	throw error;
    }
    return cardType;
};

Payment.prototype.determineCurrency = function(orderCurrency) {
		var self = this;
		var currency;

		var currencies = self.config.currencies;
		currencies.forEach(function (curr) {
			if(curr === orderCurrency){
				currency = curr;
			}
		});

    if(!currency){
    	var message = "Unknown currency type";
    	console.error(message);
    	var error = new Error(message);
    	error.status = 400;
    	throw error;
    }
    return currency;
};

Payment.prototype.determineGateway = function(cardType, orderCurrency) {
		var self = this;
		var rules = self.config.rules;

		var gateway;
		rules.forEach(function (rule) {
			if(rule.type){
				if(rule.type === cardType){
					if(rule.currency !== orderCurrency){
						var message = rule.msg;
    				console.error(message);
    				var error = new Error(message);
    				error.status = 400;
    				throw error;
					} else {
						gateway = rule.gateway;
					}
				}
			} else {
				if(rule.currency.indexOf(orderCurrency)>-1){
					gateway = rule.gateway;
				}
			}
	});

	if(!gateway){
		var message = "Could not found gateway";
    console.error(message);
    var error = new Error(message);
    error.status = 500;
    throw error;
  }
	return gateway;
};

Payment.prototype.makePayment = function(callback) {
		var self = this;
		var gateway;
		try{
			gateway = require(require('path').join(__dirname, 'gateways', this.gateway + '.js'));
		} catch(error){
			error.status = 500;
    	callback(error);
		}

		gateway.makePayment(self.paymentData, function (error, response) {
			if(error){
	      return callback(error);
	    }

	    PaymentStorage.save({
	    	"cardNumber": self.paymentData.cardNumber,
	      "cardFirstName": self.paymentData.cardFirstName,
	      "cardLastName": self.paymentData.cardLastName,
	      "cardCVV": self.paymentData.cardCVV,
	      "cardType": self.paymentData.cardType,
	      "orderTotal": self.paymentData.orderTotal,
	      "orderCurrency": self.paymentData.orderCurrency,
	      "orderFullName": self.paymentData.orderFullName,
	      "gateway": self.gateway,
	      "gatewayResponseId": response.transactionId,
	      "gatewayResponseCreateTime": Date(response.createdAt),
	      "gatewayResponseUpdateTime": Date(response.updatedAt),
	      "gatewayResponseIntent": response.intent,
	      "gatewayResponseStatus": response.status
			},function (err, saved) {
				if(err) {
					err.status = 500;
	      	callback(error);
	    	}else {
					var result = {succeed : true};
					callback(null, result);
	    	}
	  	});
	});
};

module.exports = Payment;
