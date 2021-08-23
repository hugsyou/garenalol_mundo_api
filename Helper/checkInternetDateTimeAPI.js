const moment = require('moment');

module.exports = async function () {
    try {
        /**
         * @type {import("../Types/internetDateTimeAPI.types").InternetDateTimeAPI_Response}
         */
        const Response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Bangkok");

        if (!Response.datetime) {
            return moment();
        }
        else {
            return moment(Response.datetime);
        }
    } catch (error) {
        return moment();
    }
};