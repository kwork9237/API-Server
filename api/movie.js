//영화 정보 관리 CRUD
const router = require('express').Router();
const movieController = require('./_controller/movieController');

//Default CRUD
//C : Create
router.post("/", async(req, res) => {
    const result = await movieController.create(req);
    res.json(result);
});

//R : getInfo
router.get("/", async(req, res) => {
    const result = await movieController.getInfo(req);
    res.json(result);
});

//U : Update
router.put("/:id", async(req, res) => {
    const result = await movieController.update(req);
    res.json(result);
});

//D : Delete
router.delete("/:movid", async(req, res) => {
    const result = await movieController.delete(req);
    res.json(result);
});

//RS : Reset
router.post("/reset", async(req, res) => {
    const result = await movieController.reset(req);
    res.json(result);
});

//Additional Features
//R : List
router.get("/list", async(req, res) => {
    const result = await movieController.list(req);
    res.json(result);
});

//R : advancedSearch
router.get("/asearch", async(req, res) => {
    const result = await movieController.advancedSearch(req);
    res.json(result);
});

module.exports = router;