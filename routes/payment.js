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

    try{
        var payment = new Payment(paymentData);
    } catch(error){

        // If the error caused by programmer or database
        // there is no need to send to consumer directly.
        // For this reason, only i see above errors (in background)
        // To see a "SERVER ERROR" for consumer is enough.
        // Forexample, if a configuration file not found
        // its not meaningful for consumer.
        if(error.status === 500){
            error.message = "SERVER ERROR";
        }


        if(error.status === 400){
            // If the error caused by consumer (user),
            // its meaningful to show error reason.
            // Maybe he/she filled wrong values or
            // their card type couldn't be recognised
        }

        return next(error);
    }

    payment.makePayment(function (error, response) {
        if(error){
            if(error.status === 500){
                error.message = "SERVER ERROR"
            }
            next(error);
        }else{
            res.send(response);
        }
    });
});

module.exports = router;