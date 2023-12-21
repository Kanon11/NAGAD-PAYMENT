
const helper = require("../library/helper")

const { default: axios } = require("axios");

const nagad_config = require("../config/nagad.config");
const crypto = require("crypto");

const nagad = require("../config/ngp.config");
const { dbConf, makeDb } = require("../config/db.config");
const { insert_get_charge_url_query, update_get_charge_url_query } = require("../library/db.helper");
const util = require("util");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const dayjs = require("dayjs");

dayjs.extend(utc);
dayjs.extend(timezone);
const post = async (url, payload = {}, additionalHeaders) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...additionalHeaders
    };

    console.log("from post url:", url);
    console.log("from post header:", headers);
    console.log("from post payload:", payload);

    try {
        const response = await axios.post(url, payload, { headers, });
        const data = response.data;
        console.log("from post response.headers kc1: ", response.headers);
        console.log("from post response.data kc2: ", response.data);

        if (data.devMessage) {
            throw new NagadException(data.devMessage, data.reason);
        }

        if (data.reason) {
            throw new NagadException(data.message, data.reason);
        }

        return data;
    } catch (error) {
        console.log("🚀 ~ file: payment.service.js:88 ~ post ~ error:", error)
        return error.data;
        throw new NagadException("Error in Axios request", error.message);
    }
};



const get = async (url, additionalHeaders) => {
    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...additionalHeaders
    };

    try {
        const response = await axios.get(url, { headers, });

        const data = response.data;

        if (data.devMessage) {
            throw new NagadException(data.devMessage, data.reason);
        }

        if (data.reason) {
            throw new NagadException(data.message, data.reason);
        }

        return data;
    } catch (error) {
        // Handle Axios errors here if needed
        console.log("🚀 ~ file: payment.service.js:88 ~ post ~ error:", error)
        return error.data;
        // throw new NagadException("Error in Axios request", error.message);
    }
};
let NagadException = class extends Error {
    constructor(message, reason) {
        super(reason);
        this.reason = reason;
        this.name = "NagadException";
        this.stack = this.stack ?? new Error().stack;
    }
};
const getTimeStamp = () => {
    return dayjs().tz("Asia/Dhaka").format("YYYYMMDDHHmmss");
};
const createHash = (string) => {
    return crypto.createHash("sha1").update(string).digest("hex").toUpperCase();
}
const encrypt = (data) => {
    let public_key = nagad_config.pubKey.split(String.raw`\n`).join('\n');
    public_key = formatKey(public_key, "PUBLIC");
    const signerObject = crypto.publicEncrypt(
        { key: public_key, padding: crypto.constants.RSA_PKCS1_PADDING },
        Buffer.from(JSON.stringify(data))
    );
    return signerObject.toString("base64");
}
// const encrypt = (data) => {
//     const signerObject = crypto.publicEncrypt(
//         { key: nagad_config.pubKey, padding: crypto.constants.RSA_PKCS1_PADDING },
//         Buffer.from(JSON.stringify(data))
//     );
//     return signerObject.toString("base64");
// }
const decrypt = (data) => {
    let private_key = nagad_config.privKey.split(String.raw`\n`).join('\n');
    private_key = formatKey(private_key, "PRIVATE");
    const decrypted = crypto.privateDecrypt({ key: private_key, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data, "base64")).toString();
    return JSON.parse(decrypted);
}
const sign = (data) => {
    const signerObject = crypto.createSign("SHA256");
    signerObject.update(JSON.stringify(data));
    signerObject.end();
    let private_key = nagad_config.privKey.split(String.raw`\n`).join('\n');
    private_key = formatKey(private_key, "PRIVATE");
    return signerObject.sign(private_key, "base64");
}
const formatKey = (key, type) => {
    return /begin/i.test(key) ? key.trim() : `-----BEGIN ${type} KEY-----
${key.trim()}
-----END ${type} KEY-----`;
}
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
        const order_id = "odbd"+Date.now();
        let order_object = {
            amount: amount,
            ip: '137.184.250.129',
            orderId: `${order_id}`,
            // productDetails: { a: '1', b: '2' },
            clientType: 'PC_WEB',
        };
        try {

            // const nagadURL = await nagad.createPayment(order_object);
            const nagadURL = await createPayment(amount, order_id,{},nagad_config.clientType);
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
const createPayment = async (amount, orderId, productDetails, clientType) => {
    const initialize_url = `${nagad_config.baseURL}/api/dfs/check-out/initialize/${nagad_config.merchantID}/${orderId}?`;
    const timestamp = getTimeStamp();


    const sensitive = {
        merchantId: nagad_config.merchantID,
        dateTime: timestamp,
        orderId,
        challenge: createHash(orderId)
    };

    const payload = {
        accountNumber: nagad_config.merchantNumber,
        dateTime: timestamp,
        sensitiveData: encrypt(sensitive),
        signature: sign(sensitive)
    };

    const newIP = nagad_config.ip;

    let header = {
        "X-KM-Api-Version": nagad_config.apiVersion,
        "X-KM-IP-V4": newIP,
        "X-KM-Client-Type": clientType,
    };

    const { sensitiveData } = await post(initialize_url, payload, header);

    const decrypted = decrypt(sensitiveData);

    const { paymentReferenceId, challenge } = decrypted;

    const confirmArgs = {
        paymentReferenceId,
        challenge,
        orderId,
        amount,
        productDetails,
        ip: newIP
    };
    const { callBackUrl } = await confirmPayment(confirmArgs, clientType);
    return callBackUrl;
}
const confirmPayment = async (data, clientType) => {
    const { amount, challenge, ip, orderId, paymentReferenceId, productDetails } = data;

    const sensitiveData = {
        merchantId: nagad_config.merchantID,
        orderId,
        amount,
        currencyCode: nagad_config.currencyCode,
        challenge

    };

    const payload = {
        paymentRefId: paymentReferenceId,
        sensitiveData: encrypt(sensitiveData),
        signature: sign(sensitiveData),
        merchantCallbackURL: nagad_config.callbackURL,
        additionalMerchantInfo: {
            ...productDetails
        }
    };

    let url = `${nagad_config.baseURL}/api/dfs/check-out/complete/${paymentReferenceId}`;

    let header = {
        "X-KM-Api-Version": nagad_config.apiVersion,
        "X-KM-IP-V4": ip,
        "X-KM-Client-Type": clientType
    }
    return await post(url, payload, header)
}
module.exports = {
    acquireChargingUrlService,
    webHookService
}