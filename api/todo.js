const router = require('express').Router();
const todoController = require('./_controller/todoController');

//Create
router.post("/", async(req, res) => {
    const result = await todoController.create(req);
    res.json(result);
});

//List
router.get("/", async(req, res) => {
    const result = await todoController.list(req);
    res.json(result);
});

//Update
router.put('/:id', async (req, res) => {
    const result = await todoController.update(req);
    res.json(result);
});

//Delete
router.delete('/:id', async (req, res) => {
    const result = await todoController.delete(req);
    res.json(result);
});

//Reset
router.post('/reset', async (req, res) => {
    const result = await todoController.reset(req);
    res.json(result);
});

module.exports = router;