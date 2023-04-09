//requirements
const db = require('../../plugins/mysql');
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData, currentTime, isEmpty } = require("../../util/lib");
const moment = require("../../util/moment");

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
        return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
};

const getSelectOne = async (id) => {
    try {``
        const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.TODO} WHERE id = ?`;
        const values = [id];
        const [[{ cnt }]] = await db.execute(query, values);
        return cnt;
    }

    catch (e) {
        console.log(e.message);
        return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
}

//getList
const getList = async (req) => {
    try {
        const lastId = parseInt(req.query.lastId) || 0;
        const len = parseInt(req.query.len) || 10;

        let where = "";

        if(lastId)
            where = `WHERE id < ${lastId}`;

        const query = `SELECT * FROM ${TABLE.TODO} ${where} order by id desc limit 0, ${len}`;
        const [rows] = await db.execute(query);

        return rows;
    }

    catch (e) {
        console.log(e.message);
        return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
}


//Main
const todoController = {
    //create
    create : async (req) => {
        const { title, done } = req.body;

        //body check
        if(isEmpty(title) || isEmpty(done))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));

        try {
            //insert
            const query = `INSERT INTO todo (title, done) VALUES (?, ?)`;
            const values = [title, done];
            const [rows] = await db.execute(query, values);

            if(rows.affectedRows == 1) {
                return resData(
                    STATUS.S200.result,
                    STATUS.S200.resultDesc,
                    moment().format('LT')
                );
            }
        }
        catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
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
                moment().format('LT'),
                { totalCount, list }
            );
        }

        else
            return resData(STATUS.S201.result, STATUS.S201.resultDesc, moment().format('LT'));
    },

    //update
    update : async (req) => {
        const { id } = req.params;
        const { title, done } = req.body;
        
        if(isEmpty(id) || isEmpty(title) || isEmpty(done))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));

        try {
            const query = `UPDATE ${TABLE.TODO} SET title = ?, done = ? WHERE id = ?`;
            const values = [title, done, id];
            const [rows] = await db.execute(query, values);

            if(rows.affectedRows == 1) {
                return resData(
                    STATUS.S200.result,
                    STATUS.S200.result,
                    moment().format('LT')
                );
            }
        }

        catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
        }
    },

    //delete
    delete : async (req) => {
        const { id } = req.params;
        
        if(isEmpty(id))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));

        const cnt = await getSelectOne(id);

        try {
            if(!cnt) {
                return resData(
                    STATUS.E100.result,
                    STATUS.E100.resultDesc,
                    moment().format('LT')
                );
            }

            const query = `DELETE FROM ${TABLE.TODO} WHERE id = ?;`;
            const values = [id];
            const [rows] = await db.execute(query, values);

            if(rows.affectedRows == 1) {
                return resData(
                    STATUS.S200.result,
                    STATUS.S200.resultDesc,
                    moment().format('LT')
                );
            }
        }

        catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
        }

        return rows;
    },

    //reset
    reset : async (req) => {
        //DB Truncate
        try {
            const query = `TRUNCATE TABLE ${TABLE.TODO};`;
            await db.execute(query);
        }

        catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
        }

        //Dummy Data Insert
        const { title } = req.body;
        const done = req.body.done || "N";
        const len = req.body.len || 100;

        if(isEmpty(title))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));

        try {
            let query = `INSERT INTO todo (title, done) VALUES `;
            let arr = [];

            for(let i = 0; i < len; i++)
                arr.push(`('${title}_${i}', '${done}')`);

            query = query + arr.join(",");
            const [rows] = await db.execute(query);

            if(rows.affectedRows != 0) {
                return resData(
                    STATUS.S200.result,
                    STATUS.S200.resultDesc,
                    moment().format('LT')
                );
            }
        }

        catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
        }
    },
}

module.exports = todoController;