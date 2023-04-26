const db = require('../../plugins/mysql');
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData,  isEmpty, getTime } = require("../../util/lib");

//function
//DB값 존재유무 확인
const dbValCheck = async (colName, data) => {
    try {
        //쿼리 및 데이터 확인
        const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.ABOOK} WHERE ${colName} = ?`;
        const val = [data];

        const [[{ cnt }]] = await db.execute(query, val);


        if(cnt == undefined || cnt == 0)
            return false;

        else
            return true;
    }

    catch(e) {
        return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
    }
}


//main
const abookController = {
    //Base CRUD

    //C : Create
    create : async(req) => {
        //현재 시간 (모든 컨트롤러 동일)
        ntime = getTime();

        //id & password
        const { title, date, value, type, memo } = req.body;
        let chk;

        //메모는 선택사항
        if(memo == undefined)
            memo = '';

        //type 확인
        if(type == 'increase')
            chk = true;
        else if(type == 'decrease')
            chk == true;
        else
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "type must 'increase', 'decrease'");

        //Data Check
        if(isEmpty(title) ||isEmpty(date) || isEmpty(value))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "body data is empty");

        //수가 아니면 에러 리턴
        if(isNaN(value))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "value");

        try {
            const query = `INSERT INTO ${TABLE.ABOOK} (abook_title, abook_date, abook_value, abook_type, abook_memo) VALUES (?, ?, ?, ?, ?)`
            const val = [ title, date, value, type, memo ];
            const [res] = await db.execute(query, val);

            if(res.affectedRows == 1)
                return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, "ABook Data Added");
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    //R : Read (title)
    read : async (req) => {
        ntime = getTime();

        const { title } = req.body;
        const colName = "abook_title";
        const db_chk = !(await dbValCheck(colName, title));

        if(db_chk || isEmpty(title))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "title is empty or data not found");

        try {
            const query = `SELECt * from ${TABLE.ABOOK} WHERE ${colName} = '${title}'`;
            const [res] = await db.execute(query);

            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, res);
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    //U : Update (id)
    update : async (req) => {
        ntime = getTime();

        const { id } = req.params;
        const { date, title, value, type, memo } = req.body;

        //메모는 선택사항
        if(memo == undefined)
            memo = '';

        //type 확인
        if(type == 'increase')
            chk = true;
        else if(type == 'decrease')
            chk == true;
        else
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "type must 'increase', 'decrease'");

        //Data Check
        if(isEmpty(title) ||isEmpty(date) || isEmpty(value))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "body data is empty");

        //수가 아니면 에러 리턴
        if(isNaN(value))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "value");

        try {
            const query = `UPDATE ${TABLE.ABOOK} SET abook_title = '${title}', abook_date = '${date}', abook_value = ${value}, abook_type = '${type}', abook_memo = '${memo}' WHERE id = '${id}'`;
            const val = [ title, date, value, type, memo ];
            const [res] = await db.execute(query, val);

            console.log(res);

            if(res.affectedRows == 1)
                return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, "id [" + id + "] : Data Updated!");
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },
    
    //D : Delete
    delete : async (req) => {
        ntime = getTime();

        const { id } = req.params;
        const colName = 'id';
        const db_chk = !(await dbValCheck(colName, id));

        if(db_chk)
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "data not found");

        try {
            const query = `DELETE FROM ${TABLE.ABOOK} WHERE id = ?`;
            const value = [id];
            const [res] = await db.execute(query, value);

            if(res.affectedRows == 1)
                return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, `id [${id}] delete success`);
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    //RS : reset
    reset : async (req) => {
        ntime = getTime();

        const { type } = req.body;

        try {
            await db.execute(`TRUNCATE TABLE ${TABLE.ABOOK}`);

            if(!isEmpty(type) && type == 'clear')
                return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, "ONLY TRUNCATE");
        }
        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, "ERROR : " + e);
        }

        try {
            const query = `INSERT INTO ${TABLE.ABOOK} (abook_date, abook_title, abook_value, abook_memo) VALUES `;
            let temp, x = 1;

            for(let i = 1; i <= 100; i++) {
                if(i % 10 == 0) x += 1;

                temp = `('${2000 + x}-02-02', 'title_${i}', ${1000 * x}, 'memo_${i}')`;
                await db.execute(query + temp);
            }

            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, "DUMMY DATA INSERTED");
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    //Additional Features
    //R : list (order id)
    list : async (req) => {
        ntime = getTime();

        let { start, cnt } = req.query;

        //데이터 확인
        if(isEmpty(start) || isEmpty(cnt))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "start or end is empty");

        //수 아니면 에러 리턴
        if(isNaN(start) || isNaN(cnt))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "start or end is not integer type");

        //문자열 to 숫자
        else {
            start = parseInt(start) - 1;
            cnt = parseInt(cnt);

            if(start < 0 || cnt < 1)
                return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "start or end is not negative values");
        }

        try {
            const query = `SELECT * FROM ${TABLE.ABOOK} ORDER BY id LIMIT ${start}, ${cnt}`;
            const [res] = await db.execute(query);

            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, res);
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    //R : total (date is optional)
    total : async (req) => {
        ntime = getTime();

        const { type, date } = req.body;
        
        try {
            const query = ``;
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    //D : delList
    delList : async (req) => {
        ntime = getTime();

        try {
            const query = ``;
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    }
}

module.exports = abookController;

/*

  `abook_date` varchar(20) DEFAULT NULL,
  `abook_value` int DEFAULT NULL,
  `abook_type` int DEFAULT NULL,
  `abook_memo` varchar(50) DEFAULT NULL,
*/