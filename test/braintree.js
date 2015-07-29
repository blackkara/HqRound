var braintree = require("../lib/gateways/braintree");
var assert = require("assert");

describe('generates payment data for Visa and MasterCard cards in braintree', function(){


    it("payment needs expiration month of the card", function(){
        assert.throws(function () {
            var data = paypal.generatePaymentData({
                cardNumber : "5555555555554444",
                cardType : "mastercard",
                cardCVV : 874,
                cardExpMonth : null,
                cardExpYear : 2015,
                cardFirstName : "Mustafa",
                cardLastName : "Kara",
                orderCurrency : "THB",
                orderTotal : "5.00"
            });
        });
    });


    it("payment needs expiration year of the card", function(){
        assert.throws(function () {
           var data = paypal.generatePaymentData({
                cardNumber : "5555555555554444",
                cardType : "mastercard",
                cardCVV : 874,
                cardExpMonth : 10,
                cardExpYear : null,
                cardFirstName : "Mustafa",
                cardLastName : "Kara",
                orderCurrency : "THB",
                orderTotal : "5.00"
            });
        });
    });

    it("payment needs number of the card", function(){
        assert.throws(function () {
            var data = paypal.generatePaymentData({
                cardNumber : null,
                cardType : "mastercard",
                cardCVV : 874,
                cardExpMonth : 10,
                cardExpYear : 2015,
                cardFirstName : "Mustafa",
                cardLastName : "Kara",
                orderCurrency : "THB",
                orderTotal : "5.00"
            });
        });
    });

});

describe('process of braintree payment', function () {

    it("makes payment with payment data", function(done){

        var data = {
                cardNumber : "4111111111111111",
                cardType : "visa",
                cardCVV : 874,
                cardExpMonth : 10,
                cardExpYear : 2015,
                cardFirstName : "Mustafa",
                cardLastName : "Kara",
                orderCurrency : "HKD",
                orderTotal : "5.00"
        };

        braintree.makePayment(data, function(error, payment){
            assert.equal(null, error)
            assert.notEqual(null, payment);
            done();
        });
    });

});
