/**
 * @typedef {import('../Types/mundoAPI_Profile.type').MundoAPI_ProfileResponse} MundoAPI_ProfileResponse
 */

const getMundoProfile = require('./getMundoProfile');
const { isString, isNull } = require('lodash');
const getMundoDice = require('./getMundoDice');

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