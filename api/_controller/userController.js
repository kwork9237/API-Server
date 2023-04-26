const db = require('../../plugins/mysql');
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData, isEmpty, getTime } = require("../../util/lib");

//function

//DB값 존재유무 확인
const dbValCheck = async (colName, data) => {
    try {
        //쿼리 및 데이터 확인
        const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.USER} WHERE ${colName} = ?`;
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
const userController = {
    //Base CRUD

    //C : Create
    create : async(req) => {
        //현재 시간 (모든 컨트롤러 동일)
        ntime = getTime();

        //id & password
        const { uid, upw } = req.body;

        //Data Check
        if(isEmpty(uid) || isEmpty(upw))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "uid or upw data is empty");

        //실행
        try {
            //쿼리 정의 (테이블은 변수형으로 사용, 컬럼값 지정)
            const query = `INSERT INTO ${TABLE.USER} (user_id, user_pw) VALUES (?, ?)`;
            const value = [ uid, upw ];

            //INSERT의 Return은  [ ResultSetHeader { ... }, ]
            const [ res ] = await db.execute(query, value);

            if(res.affectedRows == 1) {
                const message = "Account : " + uid + " Create Success!";

                //data가 any로 리턴되므로 메시지 추가리턴
                return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, message);
            }
        }

        //Error Status, Error Message Return
        catch(e) {
            console.log(e.message);
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, "error : " + e.message);
        }
    },

    //R : Read
    getInfo : async(req) => {
        ntime = getTime();

        const { userid } = req.body;
        const colName = "user_id";
        const db_chk = !(await dbValCheck(colName, userid));

        //데이터 확인
        if(db_chk || isEmpty(userid))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "userid is empty or data not found");

        //DB 실행
        try {
            const query = `SELECT * FROM ${TABLE.USER} WHERE ${colName} = '${userid}'`;
            const [[res]] = await db.execute(query);

            //조회값 리턴
            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, res);
        }

        catch(e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    //U : Update (pwchg)
    pwchg : async(req) => {
        ntime = getTime();

        const { userid, password } = req.body;
        const colName = "user_id";
        const db_chk = !(await dbValCheck(colName, userid));

        //빈 데이터 확인
        if(db_chk || isEmpty(userid) || isEmpty(password))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "userid, password is empty or data not found");

        //DB 실행
        try {
            const query = `UPDATE ${TABLE.USER} SET user_pw = ? WHERE ${colName} = '${userid}'`;
            const [res] = await db.execute(query, [password]);

            if(res.affectedRows == 1)
                return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, "Account [" + userid + "] password update Success");
        }

        catch(e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    //D : Delete
    delete : async(req) => {
        ntime = getTime();
        
        //지울 ID, 검색할 컬럼 정의
        const { userid } = req.params;
        const colName = "user_id";
        const db_chk = !(await dbValCheck(colName, userid));

        //둘중 하나 없을 경우 ERROR
        if(db_chk || isEmpty(userid))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "userid is empty or data not found");

        //해당 DATA 삭제 시도
        try {
            const query = `DELETE FROM ${TABLE.USER} WHERE ${colName} = ?`;
            const [res] = await db.execute(query, [userid]);

            if(res.affectedRows == 1)
                return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, userid + " DELETE SUCCESS");
        }

        catch(e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    //RS : reset
    reset : async(req) => {
        ntime = getTime();

        //DB 초기화만 할 경우 지정
        const { type } = req.body;

        //DB Truncate 시도
        try {
            await db.execute(`TRUNCATE TABLE ${TABLE.USER}`);

            //초기화 후 바로 RETURN
            if(!isEmpty(type) && type == 'clear')
                return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, "ONLY TRUNCATE");
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, "ERROR : " + e);
        }

        //값 집어넣기
        try {
            const query = `INSERT INTO ${TABLE.USER} (user_id, user_pw) VALUES `;
            let temp;

            for(let i = 1; i <= 100; i++) {
                temp = `('testAccount${i}', 'testAccount${i}')`;
                await db.execute(query + temp);
            }

            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, "DUMMY DATA INSERTED");
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, "ERROR : " + e);
        }
    },

    //Additional Features
    list : async(req) => {
        ntime = getTime();

        //소수점을 숫자형 변환하기 위해 const를 사용하지 않음
        let { start, cnt, order } = req.query;

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
            //기본 오름차순
            if(order == undefined) order = 'ASC';

            //start 부터 cnt개 조회
            const query = `SELECT * FROM ${TABLE.USER} ORDER BY uid ${order} LIMIT ${start}, ${cnt}`;
            const [res] = await db.execute(query);

            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, res);
        }

        catch(e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    rank : async(req) => {
        ntime = getTime();

        //type 단일 값 1개만 받는다.
        let { type } = req.query;

        if(isEmpty(type))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "type is empty");

        //순위 매길 타입 정의
        if(type == 'kill') type = 'user_kill';
        else if (type == 'death') type = 'user_death';
        else if (type == 'playcount') type = 'user_playcount';
        else type = 0;

        if(type == 0)
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "type not defined")

        try {
            //내림차순 데이터 (상위 10명만)
            const query = `SELECT * FROM ${TABLE.USER} ORDER BY ${type} DESC LIMIT 0, 10`;
            const [res] = await db.execute(query);

            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, res);
        }

        catch(e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    ban : async(req) => {
        ntime = getTime();

        //변수 설정 및 값 체크
        const { userid } = req.params;
        const colName = "user_banned";
        const db_chk = !(await dbValCheck(colName, userid));

        if(db_chk || isEmpty(userid))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "userid, ban is empty or data not found");

        //DB 실행
        try {
            const query = `UPDATE ${TABLE.USER} SET user_banned = 1 WHERE user_id = '${userid}'`;
            const [res] = await db.execute(query);
    
            if(res.affectedRows == 1)
                return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, "Account [" + userid + "] success banned");
        }
    
        catch(e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    events : async(req) => {
        ntime = getTime();

        //type 단일 값 1개만 받는다.
        let type = req.query.type;
        const userid = req.query.userid;
        const colName = "user_id";

        if(isEmpty(type) || isEmpty(userid))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "type is empty");

        //업데이트할 데이터 정의
        if(type == 'kill') type = 'user_kill';
        else if (type == 'death') type = 'user_death';
        else if (type == 'playcount') type = 'user_playcount';
        else type = 0;

        if(type == 0)
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "type not defined")

        try {
            //내림차순 데이터 (상위 10명만)
            const query = `UPDATE ${TABLE.USER} SET ${type} = ${type} + 1 WHERE ${colName} = '${userid}'`;
            await db.execute(query);

            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, "Success Update User Play data!");
        }

        catch(e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    }
}

module.exports = userController;

/*
  `user_id` varchar(15) NOT NULL,
  `user_pw` varchar(45) NOT NULL,
  `user_kill` int DEFAULT '0',
  `user_death` int DEFAULT '0',
  `user_playcount` int DEFAULT '0',
  `user_banned` tinyint DEFAULT '0',
*/