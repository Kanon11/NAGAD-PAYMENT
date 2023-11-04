
const helper = require("../library/helper")
const { NagadGateway } = require('nagad-payment-gateway');
const fs = require('fs');
const privateKeyPath = '../keys/merchantPrivateKey.txt';
const { BASE_URL, CALLBACK_URL, MERCHANT_ID, MERCHANT_NUMBER,P_KEY,PU_KEY } = require("../config/env.config");
const path = require("path");
const { default: axios } = require("axios");
const nAgad_json_string = fs.readFileSync(path.resolve(__dirname, "../keys/nagad_essential.json")); 
const nAgad_pgw_configuration_object = JSON.parse(nAgad_json_string); //object hoea gase;

const nagad = require("../config/ngp.config");

const webHookService = async (merchant, order_id, payment_ref_id, status, status_code, message) => {
    let response = {};
    response.statusCode = 300;
    response.status = false;
    try {
        const verifyResult = await nagad.verifyPayment(payment_ref_id);
        response.status = true;
        response.statusCode = 200;
        response.verifyResult = verifyResult;
        console.log("vf: ",verifyResult)

    } catch (error) {
        response.message = error.message;
        console.log(err);
    }
    await helper.service_log('logs', 'service_log', 'webHookService_', payment_ref_id, JSON.stringify(response));
    return response;
}
const acquireChargingUrlService = async (amount) => {
    let response = {};
    response.statusCode = 300;
    response.status = false;
    try {
        if (!!!amount) {
            response.message = "amount parameter is required";
            return response;
        }
        try {
            const nagadURL = await nagad.createPayment({
                amount: amount,
                ip: '137.184.250.129',
                orderId: `${Date.now()}`,
                // productDetails: { a: '1', b: '2' },
                clientType: 'PC_WEB',
            });
            response.status = true;
            response.statusCode = 200;
            response.nagadURL=nagadURL
        } catch (err) {
            response.message = err.message;
            console.log(err);
        }

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
    acquireChargingUrlService,
    webHookService
}