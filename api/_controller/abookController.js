const db = require('../../plugins/mysql');
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData,  isEmpty, getTime } = require("../../util/lib");

//function
//DB값 존재유무 확인
const dbValCheck = async (colName, data) => {
    try {
        //쿼리 및 데이터 확인
        const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.MOVIE} WHERE ${colName} = ?`;
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
        const { uid, upw } = req.body;

        //Data Check
        if(isEmpty(uid) || isEmpty(upw))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "body data is empty");
    },

    //R : Read
    read : async (req) => {
        ntime = getTime();
    },

    //U : Update
    update : async (req) => {
        ntime = getTime();
    },
    
    //D : Delete
    delete : async (req) => {
        ntime = getTime();
    },

    //RS : reset
    reset : async (req) => {
        ntime = getTime();
    },

    //Additional Features
    //R : list
    list : async (req) => {
        ntime = getTime();
    },

    //R : total
    total : async (req) => {
        ntime = getTime();
    },

    //D : delList
    delList : async (req) => {
        ntime = getTime();
    }
}

module.exports = abookController;

/*

  `abook_date` varchar(20) DEFAULT NULL,
  `abook_value` int DEFAULT NULL,
  `abook_type` int DEFAULT NULL,
  `abook_memo` varchar(50) DEFAULT NULL,
*/