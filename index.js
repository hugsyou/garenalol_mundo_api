const express = require('express');
const app = express();
app.use(express.json({ extended: false }));

app.get('/',
    function (req, res) {
        res.status(200).json({ result: "ok" }).end();
        return;
    }
);

app.use(function (req, res, next) {
    res.status(404).json({ result: "error", error: "ERROR_NOTFOUND" });
    return;
});

const HTTP_PORT = process.env.PORT || 8080;
app.listen(HTTP_PORT, () => console.log(`Server is running in port ${HTTP_PORT}`));