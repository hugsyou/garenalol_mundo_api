const express = require('express');
const app = express();
app.use(express.json({ extended: false }));

const HTTP_PORT = process.env.PORT || 8080;
app.listen(HTTP_PORT, () => console.log(`Server is running in port ${HTTP_PORT}`));