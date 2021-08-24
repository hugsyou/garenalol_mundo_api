const { isString, isNumber } = require('lodash');
const fetch = require('node-fetch');

module.exports = async function (Token) {
    if (!isString(Token)) { throw Error(`Require Parameter Token`); }
    else {
        const garenaLOLHeader = new fetch.Headers();
        garenaLOLHeader.append("Accept", "application/json, text/plain, */*");
        garenaLOLHeader.append("Accept-Encoding", "gzip, deflate, br");
        garenaLOLHeader.append("Accept-Language", "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7");
        garenaLOLHeader.append("Connection", "keep-alive");
        garenaLOLHeader.append("User-Agent", "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) LeagueOfLegendsClient/11.15.388.2387 (CEF 74) Safari/537.36");
        garenaLOLHeader.append("dnt", "1");
        garenaLOLHeader.append("Host", "smallpass.lol.garena.in.th");
        garenaLOLHeader.append("Referer", `https://smallpass.lol.garena.in.th/?token=${Token}&access_token=${Token}&in_game=true`);
        garenaLOLHeader.append("Sec-Fetch-Dest", "empty");
        garenaLOLHeader.append("Sec-Fetch-Mode", "cors");
        garenaLOLHeader.append("Sec-Fetch-Site", "same-origin");
        garenaLOLHeader.append("Sso-Token", Token);
        garenaLOLHeader.append("Token", Token);
        garenaLOLHeader.append("Utm-Source", "plt");
        garenaLOLHeader.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "cost": 0,
            "draw_type": 0
        });

        const requestOptions = {
            method: 'POST',
            headers: garenaLOLHeader,
            body: raw,
            redirect: 'follow'
        };

        /**
         * @type {import('../Types/mundoAPI_Dice.type').MundoAPI_DiceResponse}
         */
        const Response = await fetch("https://smallpass.lol.garena.in.th/api/draw", requestOptions).then(async (response) => await response.json());
        if (!Response) { throw Error(`getMundoAPI_Dice: can not GET`); }
        else if (!isNumber(Response.free_remain_time)) { throw Error(`getMundoAPI_Dice: can not GET <free_remain_time>`); }
        else {
            return Response;
        }
    }
};