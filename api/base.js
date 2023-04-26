const router = require('express').Router();
const baseController = require('./_controller/baseController');

//API - 기본구조
//api의 이름에 따라 주소가 달라짐

//Create
router.post("/", async(req, res) => {
    //컨트롤러 네임은 동일하게 한다.
    const result = await baseController.bcreate(req);
    res.json(result);
});

//Read
router.get("/", async(req, res) => {
    const result = await baseController.bread(req);
    res.json(result);
});

//Update
router.put("/:id", async(req, res) => {
    const result = await baseController.bupdate(req);
    res.json(result);
});

//Delete
router.delete("/:id", async(req, res) => {
    const result = await baseController.bdelete(req);
    res.json(result);
});

module.exports = router;