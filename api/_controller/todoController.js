//requirements
const db = require('../../plugins/mysql');

const todoController = {
    //PostMan router test
    /*
    //값 return
    getTest() {
        const data = {
            status : 200,
            msg : 'router test 입니다.'
        }

        return data;
    }
    */

    //DB값 return
    async getTest() {
        const query = `SELECT * FROM vue.todo`;
        const [[rows]] = await db.execute(query);
    
        return rows;
    }
}

module.exports = todoController;