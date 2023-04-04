const config = require("../config")[process.env.NODE_ENV];
const mysql = require("mysql2");

function createDatabase() {
    let instance = null;

    return {
        getInstance: function() {
            if(instance == null) {
                //pool = 수영장
                //요청을 보낼 때, 그 요청에 들어가는것 | 요청을 보낼때마다 풀이 생성된다.
                const pool = mysql.createPool(config.DB);
                instance = pool.promise();
            }

            return instance;
        }
    }
}

module.exports = createDatabase().getInstance();