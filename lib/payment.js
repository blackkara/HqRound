var PaymentStorage = require("../models/payment");
var fs = require("fs");

function Payment (paymentData) {

	if(!paymentData){
		throw new Error("not found paymentData");
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
        throw new Error(message);
    }

    try{
    	var configPaymentJson = fs.readFileSync(__dirname + "/configurations/payment.json");
    	var configPayment = JSON.parse(configPaymentJson.toString());
    	this.config = configPayment;

    } catch(error){
    	console.error("payment.json not found or not valid: " + error.message);
    	process.exit(1);
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
    	throw new Error("unknown card type");
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
    	throw new Error("unknown currency type");
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
					throw new Error(rule.msg);
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
    	throw new Error("could not found gateway");
    }
	return gateway;
};

Payment.prototype.makePayment = function(callback) {
	var self = this;
	try{
		
	    var gateway = require(require('path').join(__dirname, 'gateways', this.gateway + '.js'));
	    gateway.makePayment(self.paymentData, function (error, response) {
	    	
	    	if(error){
	      		callback(error, null);
	      		return;
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
	      	}, function (err, saved) {
	      		if(err) {
	      			var error = new Error("Database error");
	      			callback(error, null);
	      		}else {
	      			var result = {succeed : true}
	      			callback(null, result);
	      		}
	      });

	    });

	} catch(error){
    	callback(error, null);
	}
	
};

module.exports = Payment;