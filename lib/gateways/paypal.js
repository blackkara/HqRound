var paypal =  require('paypal-rest-sdk');
var fs = require('fs');

try{
    // Paypal configurations
    var configPaypalJson = fs.readFileSync("./configurations/paypal.json");
    var configPaypal = JSON.parse(configPaypalJson.toString());
    
} catch(error){
    var message = "paypal.json not found or not valid: " + error.message
    console.error(message);
    error.message = message;
    error.status = 500;
    throw error;
}

paypal.configure(configPaypal);

/**
* @param {Object} paymentData, contains payment-related data like card and order
* @param {Function} callback, to handle async response from paypal
*/
function makePayment(paymentData, callback){

    try{
        var data = generatePaymentData(paymentData);
    } catch(error){
        error.status = 500;
        return callback(error, null);
    }
   
    paypal.payment.create(data, function (error, payment) {
        console.error(error);
        if(error){
            if(error.httpStatusCode === 400){
                error.message = "Card values not valid";
            }
        } return callback(error, null);
        
        return callback(null, {
            transactionId: payment.id,
            createdAt: payment.create_time,
            updatedAt: payment.update_time,
            intent: payment.intent,
            status: payment.state
        });    
    });
};

/**
* This function generates payment data to make payment in paypal.
* These arguments are necessary to use paypal gateway 
*
* @param {Number || String} expMonth, expiration month of card
* @param {Number || String} expYear, expiration year of card
* @param {Number || String} cardNumber, number of card
* @param {Number || String} amount, total amount of order
* @param {Number || String} cvv2, card information
* @param {String} cardFirstName, card owner's first name
* @param {String} cardLastName, card owner's last name
* @param {String} currency, order's currrency
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

    if(typeof paymentData.cardCVV !== 'string' && typeof paymentData.cardCVV !== 'number')
        throw new Error('card cvv2 must be number or string.');

    if(typeof paymentData.cardFirstName !== 'string')
        throw new Error('card first name must be string.');

    if(typeof paymentData.cardLastName !== 'string')
        throw new Error('card last name must be string.');

    if(typeof paymentData.orderCurrency !== 'string')
        throw new Error('currency must be string.');

    if(typeof paymentData.cardType !== 'string')
        throw new Error('card type must be string.');

    return {
        "intent": "sale",
        "payer": {
            "payment_method": "credit_card",
            "funding_instruments": [{
                "credit_card": {
                    "type": paymentData.cardType,
                    "number": paymentData.cardNumber,
                    "expire_month": paymentData.cardExpMonth,
                    "expire_year": paymentData.cardExpYear,
                    "cvv2": paymentData.cardCVV,
                    "first_name": paymentData.cardFirstName,
                    "last_name": paymentData.cardLastName
                }
            }]
        },
        "transactions": [{
            "amount": {
                "total": paymentData.orderTotal,
                "currency": paymentData.orderCurrency
            }
        }]
    };
};


module.exports = {
    makePayment : makePayment,
    generatePaymentData: generatePaymentData
};

