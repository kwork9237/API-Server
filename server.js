//requirements
//const config = require('./config').development;
const config = require('./config')[process.env.NODE_ENV];
const express = require('express');
const http = require('http');

//Port, app
const app = express();
const port = config.PORT;
const cors = require('cors');

//API
const path = require('path');
const fs = require('fs');

//값 확인
//console.log(value);

//setting option
//cors는 네트워크 허용 (Access) 옵션
//무조건 라우터 실행 이전에 허용되어야 한다.
let corsOptions = {
    //origin : '*',
    origin : "http://localhost", //이래야 CORS 에러 안뜸 (포트지정 x)
    credentials : true,
};
app.use(cors(corsOptions));

// global settings
global.UPLOAD_PATH = path.join("upload/");
global.MEMBER_PHOTO_PATH = path.join("upload/memberPhoto");
fs.mkdirSync(MEMBER_PHOTO_PATH, { recursive: true }); // 하위까지 모두만듦

// image storage
app.use("/upload/memberPhoto", express.static("upload/memberPhoto"));

//////////////////////////////////////////////////////////////
//상단은 필수 요소.

app.use(express.json());
app.use(express.urlencoded({extended : true}));

//AutoRouter
const autoRoute = require('./autoRoute');
autoRoute('/api', app);

//Server Start (Command => yarn dev)
const webServer = http.createServer(app);
webServer.listen(port, () => {
    console.log(`http://localhost:${port}`);
})