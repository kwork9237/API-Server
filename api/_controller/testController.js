//requirements
const db = require('../../plugins/mysql');
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData, currentTime, isEmpty } = require("../../util/lib");
const moment = require("../../util/moment");

const test = {
    tcreate : async (req) => {
        //body에서 보내는 값과 const 에서 받는 값이 일치해야 한다.
        const { testcol, testcol1 } = req.body;

        const db_sql = `INSERT INTO ${TABLE.MyDB} (testcol, testcol1) VALUES (?, ?)`;
        const val = [testcol, testcol1];

        const [res] = await db.execute(db_sql, val);

        return res;
    },

    tupdate : async (req) => {

    },

    tread : async (req) => {

    },

    tdelete : async (req) => {

    },
}

module.exports = test;