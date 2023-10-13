
const helper = require("../library/helper")
const { NagadGateway } = require('nagad-payment-gateway');
const { BASE_URL, CALLBACK_URL, MERCHANT_ID, MERCHANT_NUMBER,P_KEY,PU_KEY } = require("../config/env.config")

const acquireChargingUrlService = async (amount) => {
    let response = {};
    response.statusCode = 300;
    response.status = false;
    try {
        if (!!!amount) {
            response.message = "amount parameter is required";
            return response;
        }
    
        const config = {
            apiVersion: 'v-0.2.0',
            baseURL: BASE_URL,
            callbackURL: CALLBACK_URL,
            merchantID:MERCHANT_ID,
            merchantNumber: MERCHANT_NUMBER,
            privKey: P_KEY,
            pubKey: PU_KEY,
            isPath: true,
        };

        const nagad = new NagadGateway(config);
        console.log(nagad)

        await helper.service_log('logs', 'service_log', 'acquireChargingUrlService_', 'test', 'test');
        return response;
    } catch (error) {
        response.message = error.message;
        return response;
    }
    finally {
        
    }

}
module.exports = {
    acquireChargingUrlService
}