//게임 유저 관리 CRUD
const router = require('express').Router();
const userController = require('./_controller/userController');

//Default CRUD
//C : User Create
router.post("/", async(req, res) => {
    const result = await userController.create(req);
    res.json(result);
});

//R : User Info Get (Single)
router.get("/", async(req, res) => {
    const result = await userController.getInfo(req);
    res.json(result);
});

//U : User Alter - PW
router.put("/", async(req, res) => {
    const result = await userController.pwchg(req);
    res.json(result);
});

//D : User Delete (파라메터로 동작되게 설정)
router.delete("/:userid", async(req, res) => {
    const result = await userController.delete(req);
    res.json(result);
});

//RS : Reset And Dummy insert
router.post("/reset", async(req, res) => {
    const result = await userController.reset(req);
    res.json(result);
});

//Additional Features
//라우터에 설정된 링크가 동일한 경우, 먼저 정의된 요청이 우선된다.
//R : User List (Multiple)
router.get("/list", async(req, res) => {
    const result = await userController.list(req);
    res.json(result);
});

//R : User Rank List
router.get("/rank", async (req, res) => {
    const result = await userController.rank(req);
    res.json(result);
});

//U : User ban
router.put("/ban/:userid", async(req, res) => {
    const result = await userController.ban(req);
    res.json(result);
});

//U : Events (playcount, kill, death)
router.put("/events", async (req, res) => {
    const result = await userController.events(req);
    res.json(result);
});


module.exports = router;