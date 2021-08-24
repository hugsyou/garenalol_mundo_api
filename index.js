/**
 * @type {[MundoAPI]}
 */
let SessionMundo = [];

const checkEventMundo = require('./Helper/checkEventMundo');
const middlewareRequestToken = require('./Helper/middlewareRequestToken');
const express = require('express');
const MundoAPI = require('./Helper/mundoAPI');
const fetch = require('node-fetch');
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
            const { token } = req.query;
            if (SessionMundo.findIndex(where => (where.TokenId === token)) === -1) {
                const reqMundo = new MundoAPI(token);
                await reqMundo.createTokenDice();
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
        const findResult = SessionMundo.findIndex(where => (where.TokenId === token));
        if (findResult === -1) {
            res.status(200).json({ result: 'error', error: "ERROR_TOKEN_NOTFOUND" });
            return;
        }
        else {
            res.status(200).json(SessionMundo[findResult]).end();
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
                SessionMundo[findResult].createTokenDice();
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

setInterval(() => {
    fetch("https://garenalol-mundo-api.vercel.app").catch(() => {})
}, 500);

checkEventMundo().then(() => {
    const HTTP_PORT = process.env.PORT || 8080;
    app.listen(HTTP_PORT, () => console.log(`Server is running in port ${HTTP_PORT}`));
});