const router = require('express').Router();
const tController = require('./_controller/testController');

//Create
router.post("/", async(req, res) => {
    const result = await tController.tcreate(req);
    res.json(result);
});


module.exports = router;