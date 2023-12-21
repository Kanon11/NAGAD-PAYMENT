
const helper = require("../library/helper")

// const nagad = require("../config/ngp.config"); //staging
const nagad = require("../config/ngp.config.live"); //live
const { dbConf, makeDb } = require("../config/db.config");
const { insert_get_charge_url_query, update_get_charge_url_query } = require("../library/db.helper");
const util = require("util");

const webHookService = async (merchant, order_id, payment_ref_id, status, status_code, message) => {
    let response = {};
    response.statusCode = 300;
    response.status = false;
    const dbConnection = makeDb(dbConf);
    let dbConnectionObject = util.promisify(dbConnection.query).bind(dbConnection);
    try {
        const verifyResult = await nagad.verifyPayment(payment_ref_id);
        let { merchantId, orderId, paymentRefId, amount, clientMobileNo,
            merchantMobileNo, orderDateTime, issuerPaymentDateTime, issuerPaymentRefNo, additionalMerchantInfo,
            status, statusCode, cancelIssuerDateTime, cancelIssuerRefNo, serviceType
        } = verifyResult;

        if (status === 'Success') {
            response.status = true;
            response.statusCode = 200;
            response.verifyResult = verifyResult;
            response.url = "https://ashikurrahman25.github.io/success";
        }
        else {
            response.verifyResult = verifyResult;
            response.url = "https://ashikurrahman25.github.io/failed";
        }
        let update_get_charge_url_query_result=  await update_get_charge_url_query(orderId, status, JSON.stringify(verifyResult), dbConnectionObject);
        console.log("update_get_charge_url_query_result: ", update_get_charge_url_query_result);
    } catch (error) {
        response.message = error.message;
        console.log(error);
    }

    await helper.service_log('logs', 'service_log', 'webHookService_', payment_ref_id, JSON.stringify(response));
    return response;
}
const acquireChargingUrlService = async (msisdn,amount) => {
    let response = {};
    response.statusCode = 300;
    response.status = false;
    const dbConnection = makeDb(dbConf);
    let dbConnectionObject = util.promisify(dbConnection.query).bind(dbConnection);
    try {
        if (!!!amount||!!!msisdn) {
            response.message = "required parameter is missing";
            return response;
        }
        const order_id = Date.now();
        let order_object = {
            amount: amount,
            ip: process.env.NODE_ENV === 'local' ? "103.100.102.100" : '137.184.250.129',
            orderId: `${order_id}`,
            // productDetails: { a: '1', b: '2' },
            clientType: 'PC_WEB',
        };
        try {

            const nagadURL = await nagad.createPayment(order_object);
            console.log('nagadURL: ', nagadURL);
            response.status = true;
            response.statusCode = 200;
            response.nagadURL=nagadURL
        } catch (err) {
            response.message = err.message;
            console.log(err);
        }
        if (response.statusCode === 200) {
            let insert_get_charge_url_query_result = await insert_get_charge_url_query(msisdn, amount, order_id, response.nagadURL, dbConnectionObject);
            console.log("insert_get_charge_url_query_result: ", insert_get_charge_url_query_result);
        }

        await helper.service_log('logs', 'service_log', 'acquireChargingUrlService_', JSON.stringify(order_object), JSON.stringify(response));
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