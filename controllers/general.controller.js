const helper = require("../library/helper");
const general_service = require("../services/general.service")

exports.acquireChargingUrl = async (req, res) => {
    try {

        let { amount,msisdn } = req.body;

        let result = await general_service.acquireChargingUrlService(msisdn,amount);
        await helper.api_log(req, 'logs', "controller_log", "acquireChargingUrl_", JSON.stringify(req.body), JSON.stringify(result));
        res.status(200).send(result);


    }
    catch (error) {
        res.status(500).json({ message: error.message || 'error on acquireChargingUrl' });
    }
}
exports.webHook = async (req, res) => {
    try {
        console.log("webhook req.query: ", req.query)
        let { merchant, order_id, payment_ref_id, status, status_code, message } = req.query;
        let result = await general_service.webHookService(merchant, order_id, payment_ref_id, status, status_code, message)
        await helper.api_log(req, 'logs', "controller_log", "webHook_", JSON.stringify(req.query), JSON.stringify(result));
        // res.status(200).send(result);
        res.redirect(result.url);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'error on webHook' });
    }
}