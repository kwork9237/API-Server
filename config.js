const production = {
    PORT : 3000,
    DB : {
        host : "localhost",
        user : "root",
        database : "vue",
        password : "1234",
        port : "3306",
        connectionLimit : 20,
        connectTimeout : 5000,
    },
}

const development = {
    PORT : 4000,
    DB : {
        host : "localhost",
        user : "root",
        database : "vue",
        password : "1234",
        port : "3306",
        connectionLimit : 20,
        connectTimeout : 5000,
    },
    API_SERVER : "http://localhost:4000",
    SECRET_KEY: "$2a$12$U3fh66EhjEts.vUTORXno.DKg1b30h8Z26fZll8lHUoEKIsqKYLdK",
}

module.exports = { production, development };