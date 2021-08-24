/**
 * @typedef {import('../Types/mundoAPI_Profile.type').MundoAPI_ProfileResponse} MundoAPI_ProfileResponse
 */

const { isString, isNull, isNumber } = require('lodash');
const getMundoAPI_Profile = require('./getMundoAPI_Profile');
const getMundoAPI_Dice = require('./getMundoAPI_Dice');

module.exports = class MundoAPI {
    /**
     * @type {string}
     */
    TokenId = null;

    /**
     * @type {string}
     */
    TokenDiceStatus = 'offline';

    TokenNext;

    /**
     * @type {[string]}
     */
    TokenLogs = [];

    constructor(Token) {
        if (!isString(Token)) { throw Error(`Mundo API <Token> must be String`); }
        else {
            this.TokenId = Token;

            Object.defineProperty(this, 'TokenNext', {
                get: () => this.#getTokenNext()
            });

            this.#logging(`Result: DICE-INIT-OK`);
        }
    }

    #logging(input) {
        const output = `Date: ${new Date().toISOString()} | ` + input;
        console.log(output + ` | TokenId: ${this.TokenId}`);
        this.TokenLogs.push(output);
    }

    async createTokenDice() {
        try {
            if (this.#TokenProfile) {
                this.removeTokenDice();
            }
            await this.#setTokenProfile();
            await this.#setIntervalTokenNext();
            await this.#setIntervalTokenDice();
            this.#logging(`Result: DICE-CREATE-TOKEN-OK`);
        } catch (error) {
            console.error(error);
            this.removeTokenDice();
            this.#logging(`Result: DICE-CREATE-TOKEN-ERROR`);
        }
    }
    removeTokenDice() {
        this.#clearInvervalTokenDice();
        this.#clearInvervalTokenNext();
        this.#clearTokenProfile();
        this.#logging(`Result: DICE-REMOVE-TOKEN-OK`);
    }

    /**
     * @type {MundoAPI_ProfileResponse?}
     */
    #TokenProfile = null;
    async #setTokenProfile() {
        const getProfile = await getMundoAPI_Profile(this.TokenId);
        this.#TokenProfile = getProfile;
        return getProfile;
    }
    #clearTokenProfile() {
        this.#TokenProfile = null;
    }

    /**
     * @type {NodeJS.Timeout?}
     */
    #IntervalTokenNext = null;
    /**
     * @type {number?}
     */
    #TokenNext = null;
    async #setIntervalTokenNext() {
        if (isNumber(this.#TokenProfile.free_remain_time)) {
            this.#TokenNext = this.#TokenProfile.free_remain_time;
            this.#IntervalTokenNext = setInterval(() => {
                if (isNumber(this.#TokenNext)) {
                    if (this.#TokenNext > 0) {
                        this.#TokenNext--;
                    }
                    else {
                        this.#TokenNext = 0;
                    }
                }
                else {
                    this.#TokenNext = null;
                }
            }, 1000);
        }
        else {
            this.#clearInvervalTokenNext();
        }
        this.#logging(`Result: DICE-CREATE-NEXT-OK`);
    }
    #clearInvervalTokenNext() {
        if (this.#IntervalTokenNext) {
            clearInterval(this.#IntervalTokenNext);
        }
        this.#IntervalTokenNext = null;
        this.#TokenNext = null;
        this.#logging(`Result: DICE-REMOVE-NEXT-OK`);
    }
    #getTokenNext() {
        if (isNull(this.#TokenNext)) {
            return null;
        }
        else {
            return `${new Date(this.#TokenNext * 1000).toISOString().substr(11, 8)}`;
        }
    }

    /**
     * @type {NodeJS.Timeout?}
     */
    #IntervalTokenDice = null;
    #IntervalTokenDice_Retry = 1;
    async #setIntervalTokenDice() {
        if (isNumber(this.#TokenProfile.free_remain_time) || this.#IntervalTokenDice_Retry > 3) {
            const doDice = async () => {
                await getMundoAPI_Dice(this.TokenId)
                    .then(r => this.#logging(`Result: DICE-DO-DODICE-OK`))
                    .catch(async (e) => {
                        this.#logging(`Result: DICE-DO-DODICE-ERROR`);
                        this.#logging(`Result: DICE-DO-DODICE-ERROR-RETRY${this.#IntervalTokenDice_Retry}`);
                        this.#IntervalTokenDice_Retry++;
                        setTimeout(async () => {
                            await this.createTokenDice();
                        }, 5000);
                    });
            }
            if (this.#TokenProfile.free_remain_time === 0) {
                await doDice();
            }
            else {
                this.#IntervalTokenDice = setInterval(async () => {
                    await doDice();
                }, this.#TokenProfile.free_remain_time * 1000);
            }
            this.TokenDiceStatus = 'online';
            this.#logging(`Result: DICE-CREATE-DODICE-OK`);
        }
        else {
            this.#clearInvervalTokenDice();
        }
    }
    #clearInvervalTokenDice() {
        if (this.#IntervalTokenDice) {
            clearInterval(this.#IntervalTokenDice);
        }
        this.#IntervalTokenDice = null;
        this.#IntervalTokenDice_Retry = 0;
        this.TokenDiceStatus = 'offline';
        this.#logging(`Result: DICE-REMOVE-DODICE-OK`);
    }
}