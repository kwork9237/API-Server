const db = require('../../plugins/mysql');
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData,  isEmpty, getTime } = require("../../util/lib");

//function
//DB값 존재유무 확인
const dbValCheck = async (colName, data) => {
    try {
        const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.MOVIE} WHERE ${colName} = ?`;
        const val = [data];
        const [[{ cnt }]] = await db.execute(query, val);

        if(cnt == undefined || cnt == 0)
            return false;

        else
            return true;
    }

    catch(e) {
        console.log(e.message);
        return resData(STATUS.E300.result, STATUS.E300.resultDesc, getTime(), e.message);
    }
}

//DB Search
const dbSearch = async (colName, type, like = undefined, start = 0, end = 0) => {
    let query;
    let cnt;
    
    if(start == end || start > end)
        return resData(STATUS.E100.result, STATUS.E100.resultDesc, getTime(), "start must over end value");

    try {
        //쿼리 결정
        if(type == 'runtime') {
            query = `SELECT count(*) AS cnt FROM ${TABLE.MOVIE} WHERE movie_runtime between ${start} and ${end} `;
            [[{ cnt }]] = await db.execute(query);
        }

        else {
            query = `SELECT count(*) AS cnt FROM ${TABLE.MOVIE} WHERE ${colName} LIKE '%${like}%'`;
            [[{ cnt }]] = await db.execute(query, [like]);
        }
        
        if(cnt == undefined || cnt == 0)
            return false;

        else
            return true;
    }

    catch (e) {
        console.log(e.message);
        return resData(STATUS.E300.result, STATUS.E300.resultDesc, getTime(), e.message);
    }
}

//main
const movieController = {
    //Base CRUD

    //C : Create
    create : async(req) => {
        //현재 시간 (모든 컨트롤러 동일)
        ntime = getTime();

        //id & password
        const { name, release, genre, producer, runtime, country } = req.body;

        //Data Check
        if(isEmpty(name) || isEmpty(release) || isEmpty(genre) || isEmpty(producer) || isEmpty(runtime) || isEmpty(country))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "body data is empty");

        //실행
        try {
            //쿼리 정의 (테이블은 변수형으로 사용, 컬럼값 지정)
            //같은 이름의 영화가 있을 수 있으므로 movie_name는 unique 해제
            const query = `INSERT INTO ${TABLE.MOVIE} (movie_name, movie_releasedate, movie_genre, movie_producer, movie_runtime, movie_country) VALUES (?, ?, ?, ?, ?, ?)`;
            const value = [ name, release, genre, producer, runtime, country ];

            //INSERT의 Return은  [ ResultSetHeader { ... }, ]
            const [ res ] = await db.execute(query, value);

            if(res.affectedRows == 1) {
                const message = "Movie Data Added!";

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

    //R : Read (getInfo)
    getInfo : async(req) => {
        ntime = getTime();

        //값 설정
        const { mvname } = req.body;
        const colName = "movie_name";
        const db_chk = !(await dbValCheck(colName, mvname));

        //값 확인
        if(db_chk || isEmpty(mvname))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "mvname is Empty or data not found");

        //값 불러오기
        try {
            //같은 이름의 영화를 전부 불러옴 (최대 10개)
            const query = `SELECT * from ${TABLE.MOVIE} WHERE ${colName} = '${mvname}' LIMIT 10`;
            const [res] = await db.execute(query);

            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, res);
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    //U : Update
    update : async(req) => {
        ntime = getTime();

        let { type } = req.query;
        const { name, date, genre, producer, runtime, country } = req.body;
        const { id } = req.params;

        let update_data;

        //업데이트할 정보 선택
        //name, date, genre, producer, runtime, country, all

        if(type == 'name') {
            type = 'movie_name';
            update_data = name;
        } 
        else if(type == 'date') {
            type = 'movie_releasedate';
            update_data = date;
        }
        else if(type == 'genre') {
            type = 'movie_genre';
            update_data = genre;
        }
        else if(type == 'producer') {
            type = 'movie_producer';
            update_data = producer;
        }
        else if(type == 'runtime') {
            type = 'movie_runtime';
            update_data = runtime;
        }
        else if(type == 'country') {
            type = 'movie_country';
            update_data = country;
        } 
        else if(type == 'all') {
            type = 'all';
            if(isEmpty(name) || isEmpty(date) || isEmpty(genre) || isEmpty(producer) || isEmpty(runtime) || isEmpty(country))
                return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "data is Empty")
        }
        else return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "type not defined");

        //데이터 검증
        if(type != 'all') {
            if(isEmpty(type) || isEmpty(update_data))
                return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "type or data is Empty");
        }

        else
            if(!(await dbValCheck("movid", id))) return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "data not found");

        try {
            //타입에 따른 쿼리 결정
            let query;
            if(type == 'all')
                query = `UPDATE ${TABLE.MOVIE} SET movie_name = '${name}', movie_releasedate = '${date}', movie_genre = '${genre}', movie_producer = '${producer}', movie_runtime = ${runtime}, movie_country = '${country}' WHERE movid = ${id}`;
            else
                query = `UPDATE ${TABLE.MOVIE} SET ${type} = '${update_data}' WHERE movid = ${id}`;

            const [res] = await db.execute(query);
            
            if(res.affectedRows == 1)
                return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, `update Success [movid : ${id} / movname : ${name}]`);
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    //D : Delete (movid only)
    delete : async(req) => {
        ntime = getTime();

        const { movid } = req.params;
        const colName = "movid";
        const db_chk = !(await dbValCheck(colName, movid));

        //값 검증
        if(db_chk)
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "data not found");

        try {
            const query = `DELETE FROM ${TABLE.MOVIE} WHERE ${colName} = '${movid}'`;
            const [res] = await db.execute(query);

            if(res.affectedRows == 1)
            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, movid + " DELETE SUCCESS");
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },

    //RS : reset
    reset : async(req) => {
        ntime = getTime();

        //더미데이터 쓰기 결정
        const { type } = req.body;

        //DB Truncate
        try {
            await db.execute(`TRUNCATE TABLE ${TABLE.MOVIE}`);

            //초기화 후 바로 RETURN
            if(!isEmpty(type) && type == 'clear')
                return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, "ONLY TRUNCATE");
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, "ERROR : " + e);
        }

        //값 INSERT
        try {
            const query = `INSERT INTO ${TABLE.MOVIE} (movie_name, movie_releasedate, movie_genre, movie_producer, movie_runtime, movie_country) VALUES `;
            let temp, x = 1;

            for(let i = 1; i <= 100; i++) {
                if(i % 10 == 0) x += 1;

                //연도 및 제조사 구분을 위해 일부러 x값을 넣음
                temp = `('name_${i}', '${2000 + x}-01-01', 'action', 'producer_${x}', ${x}, 'kr')`;
                await db.execute(query + temp);
            }

            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, "DUMMY DATA INSERTED");
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },
    
    //Additional Features

    //R : list (order uid)
    list : async(req) => {
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
            const query = `SELECT * FROM ${TABLE.MOVIE} ORDER BY movid LIMIT ${start}, ${cnt}`;
            const [res] = await db.execute(query);

            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, res);
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    },
    
    //R : advancedSearch (date => year)
    advancedSearch : async(req) => {
        ntime = getTime();

        let { type, like, start, end, lims, lime } = req.query;
        const { name, date, genre, producer, runtime, country } = req.body;

        let update_data;

        //특정 정보 선택
        //name, date, genre, producer, runtime, country

        //정보 처리
        if(type == 'name') {
            type = 'movie_name';
            update_data = name;
        } 
        else if(type == 'date') {
            type = 'movie_releasedate';
            update_data = date;
        }
        else if(type == 'genre') {
            type = 'movie_genre';
            update_data = genre;
        }
        else if(type == 'producer') {
            type = 'movie_producer';
            update_data = producer;
        }
        else if(type == 'runtime') {
            type = 'movie_runtime';
            update_data = runtime;
        }
        else if(type == 'country') {
            type = 'movie_country';
            update_data = country;
        } 

        //시작, 끝값 확인
        if(isEmpty(start) || isEmpty(end) || isEmpty(like) || isEmpty(type))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "parameter is empty");

        //수 아니면 에러 리턴
        if(isNaN(start) || isNaN(end))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "start or end is not integer type");

        //DB 검증
        if(!(await dbSearch(type, update_data, like, start, end)))
            return resData(STATUS.E100.result, STATUS.E100.resultDesc, ntime, "data not found (check your postman param and body)");

        try {
            let temp;
            let query, res;

            //컬럼값 제한을 두고 싶을때 사용
            if(lims != undefined && lime != undefined)
                temp = `LIMIT ${lims}, ${lime}`;

            if(type == 'movie_runtime') {
                query = `SELECT * FROM ${TABLE.MOVIE} WHERE movie_runtime between ${start} and ${end}` + temp;
                [res] = await db.execute(query);
            }
            
            else {
                query = `SELECT * FROM ${TABLE.MOVIE} WHERE ${type} LIKE '%${like}%'` + temp;
                [res] = await db.execute(query, [like]);
            }

            return resData(STATUS.S200.result, STATUS.S200.resultDesc, ntime, res);
        }

        catch (e) {
            return resData(STATUS.E300.result, STATUS.E300.resultDesc, ntime, e.message);
        }
    }
}

module.exports = movieController;