const path = require('path');
const { NagadGateway } = require('nagad-payment-gateway');
const config = {
    apiVersion: 'v-0.2.0',
    baseURL: 'https://api.mynagad.com',
    callbackURL: process.env.NODE_ENV === 'local' ? process.env.LOCAL_CALLBACK_URL : process.env.PRODUCTION_CALLBACK_URL,
    merchantID: '685500771815399',
    merchantNumber: '01550077181',
    privKey: path.resolve(__dirname, "../keys/live_pri.pem"),
    pubKey: path.resolve(__dirname, "../keys/live_pub.pem"),
    isPath: true

};
console.log("config: ", config);
const nagad = new NagadGateway(config);
module.exports = nagad;