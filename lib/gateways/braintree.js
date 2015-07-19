var braintree = require('braintree');
var fs = require('fs');

try{
    // Braintree configurations
    var configBraintreeJson = fs.readFileSync("./configurations/braintree.json");
    var configBraintree = JSON.parse(configBraintreeJson.toString());
    configBraintree.environment = braintree.Environment.Sandbox;
    
} catch(error){
    var message = "braintree.json not found or not valid: " + error.message
    console.error(message);
    error.message = message;
    error.status = 500;
    throw error;
}

var gateway = braintree.connect(configBraintree);


/**
* @param {Object} paymentData, contains payment-related data like card and order
* @param {Function} callback, to handle async response from braintree
*/
function makePayment(paymentData, callback){

    try{
        var data = generatePaymentData(paymentData);
    } catch(error){
        error.status = 500;
        return callback(error, null);
    }
    

    gateway.transaction.sale(data, function(error, payment){
        if(error) return callback(error, null);
        
        var success = payment.success;

        if(!success){
            
            if (!(payment.transaction) || payment.transaction.status !== 'authorized') {
                var err = new Error(payment.message)
                err.status = 400;
                return callback(err, null);
            }

            var err = new Error(payment.message)
            return callback(err, null);
        }

        callback(null, {
            transactionId: payment.transaction.id,
            createdAt: payment.transaction.createdAt,
            updatedAt: payment.transaction.updatedAt,
            intent: payment.transaction.type,
            status: payment.transaction.status
        });
    });
}

/**
* This function generates payment data to make payment in bratintree.
* These arguments are necessary to use braintree gateway 
*
* @param {Number || String} expMonth, expiration month of card
* @param {Number || String} expYear, expiration year of card
* @param {Number || String} cardNumber, number of card
* @param {Number || String} amount, total amount of order
*/
function generatePaymentData(paymentData){
    if(!paymentData){
       throw new Error('There is no payment data');
    }
    
    if(typeof paymentData.orderTotal !== 'string' && typeof paymentData.orderTotal !== 'number')
        throw new Error('amount must be number or string.');

    if(typeof paymentData.cardExpMonth !== 'number' && typeof paymentData.cardExpMonth !== 'string')
        throw new Error('expiration month must be number.');

    if(typeof paymentData.cardExpYear !== 'number' && typeof paymentData.cardExpYear !== 'string')
        throw new Error('expiration year must be number.');

    if(typeof paymentData.cardNumber !== 'string' && typeof paymentData.cardNumber !== 'number')
        throw new Error('card number must be number or string.');
    
    return {
        "creditCard": {
            "number": paymentData.cardNumber,
            "expirationMonth": paymentData.cardExpMonth,
            "expirationYear": paymentData.cardExpYear
        },
        "amount": paymentData.orderTotal
    };
};

module.exports = {
    makePayment: makePayment,
    generatePaymentData: generatePaymentData
};

