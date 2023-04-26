/**
 * API - 기본구조 
 * 작성할 CRUD 들의 기본 구조.
 * 이 틀 안에서 참조할 TABLE, VALUE, function 등을 추가한다.
 * 
 */

//requirements
const db = require('../../plugins/mysql');
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData, currentTime, isEmpty, getTime } = require("../../util/lib");

//함수

//db 값 확인 (변수명 변경가능)
const dbValCheck = async (data) => {
    //colName
    const col = "idtest";

    try {
        //MyDb의 col에 해당하는 값이 있는지 확인
        const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.MyDB} WHERE ${col} = ?`;
        
        //값은 무조건 array
        const val = [data];

        //개수 리턴 (console log 할 경우 [ [ { } ] ])
        const [[{ cnt }]] = await db.execute(query, val);
        return cnt;
    }

    catch (e) {
        console.log(e.message);
        return resData(STATUS.E300.result, STATUS.E300.resultDesc, getTime());
    }
}

//메인 작동부 (이름이 바뀌면 module.exports 값이 변경됨)
const base = {
    bcreate : async (req) => {
        //현재 시간 지정
        const ntime = getTime();

        //body에서 보내는 값과 const 에서 받는 값이 일치해야 한다.
        const { testcol, testcol1, testcol2 } = req.body;

        //3개의 값 중 1개라도 비어 있으면, 파라메터 오류 리턴
        if(isEmpty(testcol), isEmpty(testcol1), isEmpty(testcol3))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime);

        //명령문 시도
        try {
            //insert query
            const db_sql = `INSERT INTO ${TABLE.MyDB} (testcol, testcol1, testcol2) VALUES (?, ?, ?)`;

            //insert value
            const val = [testcol, testcol1, testcol2];

            //db execute
            const res = await db.execute(db_sql, val);
            console.log(ntime);

            //결과 return
            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime);
        }

        //오류가 생기면 DB 에러 리턴
        catch(e) {
            //오류메시지 출력
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E100.resultDesc, ntime);
        }
    },

    bread : async (req) => {
        const ntime = getTime();

        const { data } = req.query; //단일 ID read

        //data값을 가져와 비교해야 하기 때문에 data 밑에 있음.
        const dbchk = await dbValCheck(data);

        //컬럼 이름 지정
        const colName = "idtest";

        //db에 값이 없거나 파라메터 없을 경우
        if(!dbchk || isEmpty(data))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime);

        //DB 실행
        try {
            const query = `SELECT * FROM ${TABLE.MyDB} WHERE ${colName} = ?`;

            //결과 저장
            const [[rows]] = await db.execute(query, [data]);

            //결과값 return
            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, {rows});
        }

        catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E100.resultDesc, ntime);
        }
    },

    bupdate : async (req) => {
        const ntime = getTime();
        const dbchk = await dbValCheck(id);

        //파라메터와 body name는 변경 가능한 값이다.
        const { id } = req.params;
        const { testcol, testcol1, testcol2 } = req.body;

        //컬럼 이름 지정
        const colName = "idtest";

        //db에 값이 없거나 파라메터 없을 경우
        if(!dbchk || isEmpty(id) || isEmpty(testcol) || isEmpty(testcol1) || isEmpty(testcol2))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime);

        //DB 실행
        try {
            const query = `UPDATE ${TABLE.MyDB} SET testcol = ?, testcol1 = ?, testcol2 = ? WHERE ${colName} = ?`;
            const values = [testcol, testcol1, testcol2];

            const [rows] = await db.execute(query, values); //결과 출력

            if(rows.affectedRows == 1)
                return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime);
        }

        catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E100.resultDesc, ntime);
        }
    },

    bdelete : async (req) => {
        const ntime = test();
        const { id } = req.params;
        const dbchk = await dbValCheck(id);
        
        //컬럼 이름 지정
        const colName = "idtest";

        //db에 값이 없거나 파라메터 없을 경우
        if(!dbchk || isEmpty(id))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime);

        //DB 실행
        try {
            //id 컬럼은 변경 가능
            const query = `DELETE FROM ${TABLE.MyDB} WHERE ${colName} = ?`;
            const [rows] = await db.execute(query, [id]);

            //db 성공시
            if(rows.affectedRows == 1)
                return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime);
        }

        catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E100.resultDesc, ntime);
        }
    },

    //reset
    breset : async (req) => {
        const ntime = getTime();

        //DB Truncate
        try {
            const query = `TRUNCATE TABLE ${TABLE.MyDB};`;
            await db.execute(query);
        }

        catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime);
        }

        //더미데이터 insert
        try {

        }

        catch (e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime);
        }
    }
}

module.exports = base;