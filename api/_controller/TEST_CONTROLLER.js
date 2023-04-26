//사용되지 않는 컨트롤러 (기본구조용)
//

//requirements
const db = require('../../plugins/mysql');
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData, currentTime, isEmpty } = require("../../util/lib");
const moment = require("../../util/moment");

//Functions
//전역으로 사용되는 함수를 정의한다.

//메인
//컨트롤러 이름이 바뀌면 mudule.exports 부분이 같이 바뀌어야 한다.
const TEST_CONTROLLER = {
    //api에 정의된 ....Controller.FUNC_NAME 의 FUNC_NAME와 동일해야 한다.
    name : async(req) => {
        //내부 작동코드

        //DB 입출력시
        try {

        }

        //실패시 상태값 return
        catch (e) {
            return resData();
        }
    }
}

module.exports = TEST_CONTROLLER;