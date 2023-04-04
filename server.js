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
//cors는 네트워크 허용 (Access) 옵션
//무조건 라우터 실행 이전에 허용되어야 한다.
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