const { general_api_log } = require("../library/helper");
const { acquireChargingUrlService }=require("../services/general.service")

exports.acquireChargingUrl = async (req, res) => {
    try {

        let { amount } = req.body;
        
            let result = await acquireChargingUrlService(amount);
            general_api_log(req, 'logs', "acquireChargingUrl_", JSON.stringify(req.body), JSON.stringify(result));
            res.status(200).send(result);


    }
    catch (error) {
        res.status(500).json({ message: error.message || 'error on acquireChargingUrl' });
    }
}