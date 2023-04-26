const db = require('../../plugins/mysql');
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData,  isEmpty, getTime } = require("../../util/lib");

//function

//main
const abookController = {
    //Base CRUD
    create : async (req) => {

    },

    read : async (req) => {

    },

    update : async (req) => {

    },
    
    delete : async (req) => {

    },

    reset : async (req) => {

    },

    //Additional Features
    list : async (req) => {

    },

    total : async (req) => {

    },

    delete_list : async (req) => {

    },

    clear : async (req) => {

    }
}

module.exports = abookController;

/*

  `abook_date` varchar(20) DEFAULT NULL,
  `abook_value` int DEFAULT NULL,
  `abook_type` int DEFAULT NULL,
  `abook_memo` varchar(50) DEFAULT NULL,
*/