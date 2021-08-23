const moment = require('moment');
const checkInternetDateTimeAPI = require("./checkInternetDateTimeAPI");

module.exports = async function () {
    const expireEventDateTime = moment('2021-08-26T23:59:50+07:00');
    const currentDateTime = await checkInternetDateTimeAPI();
    const expireEventDateTime_Left = expireEventDateTime.diff(currentDateTime, 'millisecond', true);
    if (currentDateTime.valueOf() >= expireEventDateTime.valueOf()) {
        console.log(`Mundo Dice Event is Expired`);
        process.exit(1);
    }
    else {
        setTimeout(() => {
            console.log(`Mundo Dice Event is Exit 0 from Timeout, due Event is Expired`);
            process.exit(0);
        }, expireEventDateTime_Left);

        return true;
    }
};