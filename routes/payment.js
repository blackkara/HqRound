var express = require('express');
var router = express.Router();
var Payment = require('../lib/payment');

router.post('/payment', function(req, res, next){
    
    var paymentData = {
        "cardFirstName" : req.body.cardFirstName,
        "cardLastName"  : req.body.cardLastName,
        "cardNumber"    : req.body.cardNumber,
        "cardExpMonth"  : req.body.cardExpMonth,
        "cardExpYear"   : req.body.cardExpYear,
        "cardCVV"       : req.body.cardCVV,
        "orderTotal"    : req.body.orderTotal,
        "orderCurrency" : req.body.orderCurrency,
        "orderFullName" : req.body.orderFullName
    };

    
    var payment = new Payment(paymentData);

    payment.makePayment(function (error, response) {
        if(error){
            next(error);
        }else{
            res.send(response);
        }
    });
});

module.exports = router;