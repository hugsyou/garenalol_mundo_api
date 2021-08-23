/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 372:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const moment = __nccwpck_require__(680);
const checkInternetDateTimeAPI = __nccwpck_require__(209);

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

/***/ }),

/***/ 209:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const moment = __nccwpck_require__(680);

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

/***/ }),

/***/ 718:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { isString } = __nccwpck_require__(478);
const fetch = __nccwpck_require__(441);

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

        await fetch("https://smallpass.lol.garena.in.th/api/draw", requestOptions);

        return true;
    }
};

/***/ }),

/***/ 474:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { isString } = __nccwpck_require__(478);
const fetch = __nccwpck_require__(441);

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

        const requestOptions = {
            method: 'GET',
            headers: garenaLOLHeader,
            redirect: 'follow'
        };

        /**
         * @type {import("../Types/mundoAPI_Profile.type").MundoAPI_ProfileResponse}
         */
        const Response = await fetch("https://smallpass.lol.garena.in.th/api/profile", requestOptions).then(async (response) => await response.json());

        if (!Response) { throw Error(`getMundoAPI: can not GET`); }
        else if (!Response.uid) { throw Error(`getMundoAPI: can not GET <uid>`); }
        else {
            return Response;
        }
    }
};

/***/ }),

/***/ 506:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { isString } = __nccwpck_require__(478);

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports = function (req, res, next) {
    const { token } = req.query;
    if (!isString(token)) {
        res.status(400).json({ result: 'error', error: 'ERROR_BADREQUEST' }).end();
        return;
    }
    else if (token.length !== 64) {
        res.status(400).json({ result: 'error', error: 'ERROR_BADREQUEST_LENGTH' }).end();
        return;
    }
    else {
        next();
    }
}

/***/ }),

/***/ 603:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * @typedef {import('../Types/mundoAPI_Profile.type').MundoAPI_ProfileResponse} MundoAPI_ProfileResponse
 */

const getMundoProfile = __nccwpck_require__(474);
const { isString, isNull } = __nccwpck_require__(478);
const getMundoDice = __nccwpck_require__(718);

module.exports = class MundoAPI {
    /**
     * @type {string}
     */
    TokenId = null;
    /**
     * @type {string}
     */
    TokenStatus = 'offline';

    /**
     * @type {MundoAPI_ProfileResponse?}
     */
    #MundoDice_Profile = null;

    /**
     * @type {NodeJS.Timeout?}
     */
    #MundoDice_Interval = null;

    #MundoDice_Next_Number = null;

    /**
     * @type {number?}
     */
    TokenNext = null;

    /**
     * @type {[string]}
     */
    TokenLogs = [];

    #MundoDice_ErrorCount = 0;
    get MundoDice_ErrorCount() { return this.#MundoDice_ErrorCount; }

    constructor(Token) {
        if (!isString(Token)) { throw Error(`Mundo API <Token> must be String`); }
        else {
            this.TokenId = Token;

            Object.defineProperty(this, 'TokenNext', {
                get: () => this.#getTokenNext()
            });

            this.TokenLogs.push(`Date: ${new Date().toISOString()} | Result: DICE-CREATE`);
        }
    }

    #getTokenNext() {
        if (isNull(this.#MundoDice_Next_Number)) {
            return null;
        }
        else {
            return `${new Date(this.#MundoDice_Next_Number * 1000).toISOString().substr(11, 8)}`;
        }
    }

    /**
     * @type {NodeJS.Timeout?}
     */
    #intervalTokenNext;
    #setTokenNext() {
        this.#clearTokenNext();
        this.#intervalTokenNext = setInterval(() => {
            if (!isNull(this.#MundoDice_Next_Number)) {
                if ((this.#MundoDice_Next_Number - 1) > 0) {
                    this.#MundoDice_Next_Number = this.#MundoDice_Next_Number - 1;
                }
                else {
                    this.#MundoDice_Next_Number = 0;
                }
            }
        }, 1000);
    }

    #clearTokenNext() {
        if (this.#intervalTokenNext) {
            clearInterval(this.#intervalTokenNext);
            this.#intervalTokenNext = null;
        }
    }

    #MundoProfile_ErrorMax = 3;
    get MundoProfile_ErrorMax() { return this.#MundoProfile_ErrorMax; }
    
    #MundoProfile_ErrorCount = 1;
    get MundoProfile_ErrorCount() { return this.#MundoProfile_ErrorCount; }

    async setMundoProfile() {
        const getPorfile = await getMundoProfile(this.TokenId)
            .then(r => {
                this.TokenLogs.push(`Date: ${new Date().toISOString()} | Result: PORFILE-OK`);
                return r;
            })
            .catch(e => {
                this.TokenLogs.push(`Date: ${new Date().toISOString()} | Result: PORFILE-ERROR`);
            });
        if (!getPorfile) {
            if (this.#MundoProfile_ErrorCount > this.#MundoProfile_ErrorMax) {
                this.TokenLogs.push(`Date: ${new Date().toISOString()} | Result: PORFILE-ERROR-RETRY-MAX`);
                this.clearMundoFreeDice();
            }
            else {
                this.TokenLogs.push(`Date: ${new Date().toISOString()} | Result: PORFILE-RETRY-${this.#MundoProfile_ErrorCount}`);
                this.#MundoProfile_ErrorCount++;
                setTimeout(async () => {
                    await this.setMundoProfile();
                }, 5000);
            }
        }
        else {
            this.#MundoProfile_ErrorCount = 1;
            this.#MundoDice_Profile = getPorfile;
            this.#MundoDice_Next_Number = this.#MundoDice_Profile.free_remain_time;
            this.#setTokenNext();
            return this.#MundoDice_Profile;
        }
    }

    async setMundoFreeDice() {
        if (this.#MundoDice_Interval) {
            this.clearMundoFreeDice();
        }
        await this.setMundoProfile();

        this.#MundoDice_Interval = setInterval(async () => {
            await this.#doFreeDice();
            await this.setMundoFreeDice().catch(() => { });
        }, this.#MundoDice_Profile.free_remain_time * 1000);

        this.TokenStatus = 'online';
        this.TokenLogs.push(`Date: ${new Date().toISOString()} | Result: DICE-START`);
    }

    clearMundoFreeDice() {
        if (this.#MundoDice_Interval) {
            clearTimeout(this.#MundoDice_Interval);
        }
        this.#MundoDice_Interval = null;

        this.#clearTokenNext();

        this.#MundoDice_Profile = null;

        this.TokenStatus = 'offline';
        this.TokenLogs.push(`Date: ${new Date().toISOString()} | Result: DICE-STOP`);
    }

    async #doFreeDice() {
        return await getMundoDice()
            .then(r => {
                this.TokenLogs.push(`Date: ${new Date().toISOString()} | Result: DICE-OK`);
                this.#MundoDice_ErrorCount = 0;
                return true;
            })
            .catch(e => {
                this.TokenLogs.push(`Date: ${new Date().toISOString()} | Result: DICE-ERROR`);
                this.#MundoDice_ErrorCount++;
                return false;
            });
    }
}

/***/ }),

/***/ 829:
/***/ ((module) => {

module.exports = eval("require")("express");


/***/ }),

/***/ 478:
/***/ ((module) => {

module.exports = eval("require")("lodash");


/***/ }),

/***/ 680:
/***/ ((module) => {

module.exports = eval("require")("moment");


/***/ }),

/***/ 441:
/***/ ((module) => {

module.exports = eval("require")("node-fetch");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/**
 * @type {[MundoAPI]}
 */
let SessionMundo = [];

const checkEventMundo = __nccwpck_require__(372);
const middlewareRequestToken = __nccwpck_require__(506);
const express = __nccwpck_require__(829);
const MundoAPI = __nccwpck_require__(603);
const app = express();
app.use(express.json({ extended: false }));


app.get('/',
    function (req, res) {
        res.status(200).json({ result: 'ok' }).end();
        return;
    }
);

app.get('/create',
    middlewareRequestToken,
    async function (req, res) {
        try {
            const { token, start } = req.query;
            if (SessionMundo.filter(where => (where.TokenId === token)).length === 0) {
                const reqMundo = new MundoAPI(token);
                await reqMundo.setMundoProfile();
                if (start === 'true') { await reqMundo.setMundoFreeDice(); }
                SessionMundo.push(reqMundo);
                res.status(201).json({ result: 'ok', token: token, status: 'created' });
                return;
            }
            else {
                res.status(200).json({ result: 'ok', token: token, status: 'exists' }).end();
                return;
            }
        } catch (error) {
            console.error(error);
            res.status(422).json({ result: 'error', error: 'ERROR_UNPROCESSENTITY' });
            return;
        }
    }
);

app.get('/status',
    middlewareRequestToken,
    function (req, res) {
        const { token } = req.query;
        const findResult = SessionMundo.filter(where => (where.TokenId === token));
        if (findResult.length === 0) {
            res.status(200).json({ result: 'error', error: "ERROR_TOKEN_NOTFOUND" });
            return;
        }
        else {
            res.status(200).json(SessionMundo[0]).end();
            return;
        }
    }
);

app.get('/start',
    middlewareRequestToken,
    async function (req, res) {
        try {
            const { token } = req.query;
            const findResult = SessionMundo.filter(where => (where.TokenId === token));
            if (findResult.length === 0) {
                res.status(200).json({ result: 'error', error: "ERROR_TOKEN_NOTFOUND" });
                return;
            }
            else {
                await SessionMundo[0].setMundoFreeDice();
                res.status(200).json({ result: 'ok', token: token, status: 'started' }).end();
                return;
            }
        } catch (error) {
            res.status(422).json({ result: 'error', error: 'ERROR_UNPROCESSENTITY' });
            return;
        }
    }
);

app.get('/stop',
    middlewareRequestToken,
    function (req, res) {
        try {
            const { token } = req.query;
            const findResult = SessionMundo.filter(where => (where.TokenId === token));
            if (findResult.length === 0) {
                res.status(200).json({ result: 'error', error: "ERROR_TOKEN_NOTFOUND" });
                return;
            }
            else {
                SessionMundo[0].clearMundoFreeDice();
                res.status(200).json({ result: 'ok', token: token, status: 'stoped' }).end();
                return;
            }
        } catch (error) {
            res.status(422).json({ result: 'error', error: 'ERROR_UNPROCESSENTITY' });
            return;
        }
    }
);

app.get('/delete',
    middlewareRequestToken,
    async function (req, res) {
        try {
            const { token } = req.query;
            const findResult = SessionMundo.findIndex(where => (where.TokenId === token));
            if (findResult === -1) {
                res.status(200).json({ result: 'error', error: "ERROR_TOKEN_NOTFOUND" });
                return;
            }
            else {
                SessionMundo[findResult].clearMundoFreeDice();
                SessionMundo.splice(findResult, 1);
                res.status(200).json({ result: 'ok', token: token, status: 'deleted' }).end();
                return;
            }
        } catch (error) {
            res.status(422).json({ result: 'error', error: 'ERROR_UNPROCESSENTITY' });
            return;
        }
    }
);

app.use(function (req, res, next) {
    res.status(404).json({ result: 'error', error: "ERROR_NOTFOUND" });
    return;
});

checkEventMundo().then(() => {
    const HTTP_PORT = process.env.PORT || 8080;
    app.listen(HTTP_PORT, () => console.log(`Server is running in port ${HTTP_PORT}`));
});
})();

module.exports = __webpack_exports__;
/******/ })()
;