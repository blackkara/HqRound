var paypal = require("../lib/gateways/paypal");
var assert = require("assert");

describe('generates payment data for AmericanExpress card in paypal', function(){


    it("payment needs expiration month of the card", function(){
        assert.throws(function () {
            var data = paypal.generatePaymentData({
                cardNumber : "378282246310005",
                cardType : "amex",
                cardCVV : 874,
                cardExpMonth : null,
                cardExpYear : 2018,
                cardFirstName : "Mustafa",
                cardLastName : "Kara",
                orderCurrency : "USD",
                orderTotal : "5.00"
            });
        });
    });


    it("payment needs expiration year of the card", function(){
        assert.throws(function () {
            var data = paypal.generatePaymentData({
                cardNumber : "378282246310005",
                cardType : "amex",
                cardCVV : 874,
                cardExpMonth : 11,
                cardExpYear : null,
                cardFirstName : "Mustafa",
                cardLastName : "Kara",
                orderCurrency : "USD",
                orderTotal : "5.00"
            });
        });
    });

    it("payment needs number of the card", function(){
        assert.throws(function () {
           var data = paypal.generatePaymentData({
                cardNumber : null,
                cardType : "amex",
                cardCVV : 874,
                cardExpMonth : 11,
                cardExpYear : 2018,
                cardFirstName : "Mustafa",
                cardLastName : "Kara",
                orderCurrency : "USD",
                orderTotal : "5.00"
            });
        });
    });

    it("payment needs amount of the order", function(){
        assert.throws(function () {
           var data = paypal.generatePaymentData({
                cardNumber : "378282246310005",
                cardType : "amex",
                cardCVV : 874,
                cardExpMonth : 11,
                cardExpYear : 2018,
                cardFirstName : "Mustafa",
                cardLastName : "Kara",
                orderCurrency : "USD",
                orderTotal : null
            });
        });
    });

    it("generated data must contain creditCard properties", function(){
        var paymenData = {
            cardNumber : "378282246310005",
            cardType : "amex",
            cardCVV : 874,
            cardExpMonth : 11,
            cardExpYear : 2018,
            cardFirstName : "Mustafa",
            cardLastName : "Kara",
            orderCurrency : "USD",
            orderTotal : "5.00"
        };
        var data = paypal.generatePaymentData(paymenData);

        assert.equal(paymenData.cardNumber, data.payer.funding_instruments[0].credit_card.number);
        assert.equal(paymenData.cardExpMonth, data.payer.funding_instruments[0].credit_card.expire_month);
        assert.equal(paymenData.cardExpYear, data.payer.funding_instruments[0].credit_card.expire_year);
        assert.equal(paymenData.cardCVV, data.payer.funding_instruments[0].credit_card.cvv2);
        assert.equal(paymenData.cardFirstName, data.payer.funding_instruments[0].credit_card.first_name);
        assert.equal(paymenData.cardLastName, data.payer.funding_instruments[0].credit_card.last_name);
        assert.equal(paymenData.orderTotal, data.transactions[0].amount.total);
        assert.equal(paymenData.orderCurrency, data.transactions[0].amount.currency);

    });

});

describe('process of paypal payment', function () {

    // paypal operation takes so long time, to run test well,
    // increase the timeout parameter, now its 60000 ms
    // 'mocha --recursive --timeout 60000'
    it("makes payment with payment data", function(done){

        var data = {
            cardNumber : "378282246310005",
            cardType : "amex",
            cardCVV : 874,
            cardExpMonth : 11,
            cardExpYear : 2018,
            cardFirstName : "Mustafa",
            cardLastName : "Kara",
            orderCurrency : "USD",
            orderTotal : "5.00"
        };

        paypal.makePayment(data, function(error, payment){
            assert.equal(null, error);
            assert.notEqual(null, payment);
            done();
        });
    });

});
