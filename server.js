//requirements
const config = require('./config').development;
const express = require('express');
const http = require('http');

//Port, app
const app = express();
const port = config.PORT;
const cors = require('cors');

//값 확인
//console.log(value);

//setting option
let corsOptions = {
    origin : '*',
    credential : true,
};
app.use(cors(corsOptions));

//AutoRouter
const autoRoute = require('./autoRoute');
autoRoute('/api', app);

//Server Start (Command => yarn dev)
const webServer = http.createServer(app);
webServer.listen(port, () => {
    console.log(`http://localhost:${port}`);
})