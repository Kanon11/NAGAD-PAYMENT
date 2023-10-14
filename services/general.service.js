
const helper = require("../library/helper")
const { NagadGateway } = require('nagad-payment-gateway');
const fs = require('fs');
const privateKeyPath = '../keys/merchantPrivateKey.txt';
const { BASE_URL, CALLBACK_URL, MERCHANT_ID, MERCHANT_NUMBER,P_KEY,PU_KEY } = require("../config/env.config");
const path = require("path");
const { default: axios } = require("axios");
const nAgad_json_string = fs.readFileSync(path.resolve(__dirname, "../keys/nagad_essential.json")); 
const nAgad_pgw_configuration_object = JSON.parse(nAgad_json_string); //object hoea gase;

const acquireChargingUrlService_old = async (amount) => {
    let response = {};
    response.statusCode = 300;
    response.status = false;
    try {
        if (!!!amount) {
            response.message = "amount parameter is required";
            return response;
        }
        let baseURL = "https://securepay.magicway.io/api/V1";
        let client_id = 'mkd6435c91b4a19e331aa';
        let client_secret = "d61792c501a971b4a19e331aa68842gf";
        let username = "mkiddo";
        let email = "mkiddo@momagicbd.com";

        let payload = JSON.stringify({
            "store_id": client_id,
            "grant_type": "password",
            "store_secret": client_secret,
            "username": username,
            "email": email
        })
        const token_response = await axios.post(`${baseURL}/auth/token`, payload, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const apiResponse = token_response.data;
        response.apiResponse = apiResponse;
        await helper.service_log('logs', 'service_log', 'acquireChargingUrlService_', 'test', 'test');
        return response;
    } catch (error) {
        response.message = error.message;
        return response;
    }
    finally {
        
    }

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
        const config = {
            apiVersion: 'v-0.2.0',
            baseURL: nAgad_pgw_configuration_object['BASE_URL'],
            callbackURL: nAgad_pgw_configuration_object['CALLBACK_URL'],
            merchantID: nAgad_pgw_configuration_object.MERCHANT_ID,
            merchantNumber: nAgad_pgw_configuration_object.MERCHANT_NUMBER,
            privKey:  nAgad_pgw_configuration_object.PRIVATE_KEY ,
            pubKey: nAgad_pgw_configuration_object.PUBLIC_KEY,
            isPath: false,
        };

        const nagad = new NagadGateway(config);
            console.log({nagad})
        try {
            const nagadURL = await nagad.createPayment({
                amount: amount,
                ip: '10.10.0.10',
                orderId: `${Date.now()}`,
                productDetails: { a: '1', b: '2' },
                clientType: 'PC_WEB',
            });
            response.nagadURL=nagadURL
            // console.log(nagadURL);
            //redirect user to the nagad url
        } catch (err) {
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
    acquireChargingUrlService
}