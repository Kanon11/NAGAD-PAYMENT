const generalController = require("../controllers/general.controller");
module.exports = (app) => {
    
    app.post("/general/acquire-charging-url", generalController.acquireChargingUrl);
    app.post("/general/webhook", generalController.webHook);
}