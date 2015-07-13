Hotel Quickly Sample
========================

This application based on express framework, has one route that only accepts incoming post requests for the payment operations and also accepts a path too for interacting with user. So user fills corresponed inputs, and on the backend, server-side code determines which payment option will be used. After all, the order info and responed info from payment server, these will be saved on db.

To start application, it needs to install needed dependencies, mainly they are express.js and mongodb

```
npm install
node server.js
```

To test application (test includes async operations, so it needs recursive and timeout parameters)

```
mocha --recursive --timeout 30000
```