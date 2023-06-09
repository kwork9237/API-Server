const moment = require('moment');
const lib = {
    resData : (status, message, resDate, data) => {
        return {status, message, resDate, data}
    },

    isEmpty(value) {
        if( value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length))
            return true;

        else
            return false;
    },

    //현재 시간 반환
    getTime() {
        return moment().format('LT');
    },

    getIp(req) {
        return req.ip.replace("::1", "127.0.0.1");
    },
};

module.exports = lib;