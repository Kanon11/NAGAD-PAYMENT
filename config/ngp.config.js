const path = require('path');
const { NagadGateway } = require('nagad-payment-gateway');
const config = {
    apiVersion: 'v-0.2.0',
    baseURL: 'http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0',
    callbackURL: process.env.NODE_ENV === 'local' ? process.env.LOCAL_CALLBACK_URL : process.env.PRODUCTION_CALLBACK_URL,
    merchantID: '689701002445399',
    merchantNumber: '01970100244',
    privKey: path.resolve(__dirname, "../keys/01970100244_pri.pem"),
    pubKey: path.resolve(__dirname, "../keys/01970100244_pub.pem"),
    isPath: true

};
console.log("config: ", config);
const nagad = new NagadGateway(config);
module.exports = nagad;