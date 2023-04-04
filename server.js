const config = require('./config')[process.env.NODE_ENV];
const express = require('express');
const http = require('http');

const app = express();
const port = config.PORT;
const router = express.Router();

/*
router.get('/', (req, res) => {
    res.json({
        status : 200,
        data : 'success',
    })
})
app.use('/api', router);
*/

const todoRouter = require('./api/todo');
app.use('/api', todoRouter);

const webServer = http.createServer(app);
webServer.listen(port, () => {
    console.log(`http://localhost:${port}`);
})