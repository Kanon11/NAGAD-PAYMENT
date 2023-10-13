const acquireChargingUrlService = async (amount) => {
    let response = {};
    response.statusCode = 300;
    response.status = false;
    try {
        if (!!!amount) {
            response.message = "amount parameter is required";
            return response;
        }
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