Hotel Quickly Sample
========================

This application based on express framework, has one route that only accepts incoming post requests for the payment operations and also accepts a path too for interacting with user. So user fills corresponed inputs, and on the backend, server-side code determines which payment option will be used. After all, the order info and responed info from payment server, these will be saved on db.

To start application, it needs to install needed dependencies, mainly they are express.js and mongodb

```
npm install
node server.js
```

To test application (test includes async operations and sub directory tests, so it uses recursive and timeout parameters in package.json)

```
npm test
```

```
Runs on
http://localhost:3000/payment
```

After braintree payment db record
```json
{
    "_id": {
        "$oid": "55a8ae50e6eb42180faf2f66"
    },
    "cardNumber": "4012888888881881",
    "cardFirstName": "Mustafa",
    "cardLastName": "Kara",
    "cardCVV": 874,
    "cardType": "visa",
    "orderTotal": "5.00",
    "orderCurrency": "HKD",
    "orderFullName": "Cafer Kara",
    "gateway": "braintree",
    "gatewayResponseId": "drdkzt",
    "gatewayResponseCreateTime": "Fri Jul 17 2015 10:27:10 GMT+0300 (Türkiye Yaz Saati)",
    "gatewayResponseUpdateTime": "Fri Jul 17 2015 10:27:10 GMT+0300 (Türkiye Yaz Saati)",
    "gatewayResponseIntent": "sale",
    "gatewayResponseStatus": "authorized"
}
```

After paypal payment db record
```json
{
    "_id": {
        "$oid": "55a320c1fdca723408bbb763"
    },
    "cardNumber": "378282246310005",
    "cardFirstName": "İsmail",
    "cardLastName": "Kara",
    "cardCVV": 874,
    "cardType": "amex",
    "orderTotal": "100",
    "orderCurrency": "USD",
    "orderFullName": "Cafer",
    "gateway": "paypal",
    "gatewayResponseId": "PAY-3GU213534H253803VKWRSBNI",
    "gatewayResponseCreateTime": "Mon Jul 13 2015 05:21:53 GMT+0300 (Türkiye Yaz Saati)",
    "gatewayResponseUpdateTime": "Mon Jul 13 2015 05:21:53 GMT+0300 (Türkiye Yaz Saati)",
    "gatewayResponseIntent": "sale",
    "gatewayResponseStatus": "approved"
}
```
