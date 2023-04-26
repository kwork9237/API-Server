const db = require('../../plugins/mysql');
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData, isEmpty, getTime } = require("../../util/lib");

//function



//main
const userController = {
    //Base CRUD
    create : async(req) => {

    },

    getInfo : async(req) => {

    },

    pwchg : async(req) => {

    },

    delete : async(req) => {

    },

    reset : async(req) => {

    },

    //Additional Features
    list : async(req) => {

    },

    rank : async(req) => {

    },

    ban : async(req) => {

    },

    events : async(req) => {

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