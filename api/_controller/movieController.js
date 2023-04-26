const db = require('../../plugins/mysql');
const TABLE = require("../../util/TABLE");
const STATUS = require("../../util/STATUS");
const { resData,  isEmpty, getTime } = require("../../util/lib");

//function


//main
const movieController = {
    //Base CRUD
    create : async(req) => {

    },

    getInfo : async(req) => {

    },

    update : async(req) => {

    },

    delete : async(req) => {

    },

    reset : async(req) => {

    },
    
    //Additional Features
    list : async(req) => {

    },
    
    advancedSearch : async(req) => {

    }
}

module.exports = movieController;

/*
  `movie_name` varchar(50) DEFAULT NULL,
  `movie_relesedate` datetime DEFAULT NULL,
  `movie_genre` varchar(20) DEFAULT NULL,
  `movie_producer` varchar(45) DEFAULT NULL,
  `movie_runtime` int DEFAULT NULL COMMENT 'by minute',
  `movie_country` varchar(15) DEFAULT NULL,
*/