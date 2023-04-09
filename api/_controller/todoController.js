//requirements
const db = require('../../plugins/mysql');
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData, currentTime, isEmpty } = require("../../util/lib");

//Functions

//list
const getTotal = async() => {
    try {
        const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.TODO}`;
        const [[{ cnt }]] = await db.execute(query);
        return cnt;
    }
    
    catch (e) {
        console.log(e.message);
        return resData(STATUS.E300.result, STATUS.E300.resultDesc, currentTime());
    }
};

//getList
const getList = async (req) => {
    try {
        const lastId = parseInt(req.query.lastId) || 0;
        const len = parseInt(req.query.len) || 10;

        let where = "";

        if(lastid)
            where = `WHERE id < ${lastId}`;

        const query = `SELECT * FROM ${TABLE.TODO} ${where} order by id desc limit 0, ${len}`;
        const [rows] = await db.execute(query);

        return rows;
    }

    catch (e) {
        console.log(e.message);
        return resData(STATUS.E300.result, STATUS.E300.resultDesc, currentTime());
    }
}



//Main
const todoController = {
    //create
    create : async (req) => {
        const { title, done } = req.body;

        //body check
        if(isEmpty(title) || isEmpty(done))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, currentTime());

        try {
            //insert
            const query = `INSERT INTO todo (title, done) VALUES (?, ?)`;
            const values = [title, done];
            const [rows] = await db.execute(query, values);

            if(rows.affectedRows == 1) {
                return resData(
                    STATUS.S200.result,
                    STATUS.S200.resultDesc,
                    currentTime()
                );
            }
        }
        catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, currentTime());
        }
    },

    //list
    list : async (req) => {
        const totalCount = await getTotal();
        const list = await getList(req);

        if (totalCount > 0 && list.length) {
            return resData(
                STATUS.S200.result,
                STATUS.S200.resultDesc,
                currentTime(),
                { totalCount, list }
            );
        }
        else
            return resData(STATUS.S201.result, STATUS.S201.resultDesc, currentTime());
    },
}

module.exports = todoController;