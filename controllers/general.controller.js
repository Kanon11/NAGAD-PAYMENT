const helper = require("../library/helper");
const general_service = require("../services/general.service")

exports.acquireChargingUrl = async (req, res) => {
    try {

        let { amount } = req.body;

        let result = await general_service.acquireChargingUrlService(amount);
        await helper.api_log(req, 'logs', "controller_log", "acquireChargingUrl_", JSON.stringify(req.body), JSON.stringify(result));
        res.status(200).send(result);


    }
    catch (error) {
        res.status(500).json({ message: error.message || 'error on acquireChargingUrl' });
    }
}