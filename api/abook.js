//가계부 CRUD
const router = require('express').Router();
const abookController = require('./_controller/abookController');

//Default CRUD
//C : Create
router.post("/", async(req, res) => {
    const result = await abookController.create(req);
    res.json(result);
});

//R : read (recent one)
router.get("/", async(req, res) => {
    const result = await abookController.read(req);
    res.json(result);
});

//U : Update
router.put("/:id", async(req, res) => {
    const result = await abookController.update(req);
    res.json(result);
});

//D : Delete
router.delete("/:id", async(req, res) => {
    const result = await abookController.delete(req);
    res.json(result);
});

//RS : Reset (dummy insert)
router.post("/reset", async(req, res) => {
    const result = await abookController.reset(req);
    res.json(result);
});

//Additional Features
//R : list
router.get("/list", async(req, res) => {
    const result = await abookController.list(req);
    res.json(result);
});

//R : total
router.get("/total", async(req, res) => {
    const result = await abookController.total(req);
    res.json(result);
});

//D : Delete List
router.delete("/delList", async(req, res) => {
    const result = await abookController.delete(req);
    res.json(result);
});

module.exports = router;