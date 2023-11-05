async function insert_get_charge_url_query(msisdn,amount,order_id,nagad_url,query) {
    let sql = `insert into get_charge_url(msisdn,amount,order_id,nagad_url) value('${msisdn}','${amount}','${order_id}','${nagad_url}');`;
    console.log("insert_get_charge_url_query: ", sql);
    return await query(sql);
}
async function update_get_charge_url_query(order_id, status, verify_result, query) {
    let sql = `update get_charge_url set status='${status}',verify_result='${verify_result}' where order_id='${order_id}'`;
    console.log("update_get_charge_url_query: ", sql);
    return await query(sql);
}

module.exports = {
    insert_get_charge_url_query,
    update_get_charge_url_query
}