/*
module.exports = {
    "host": "sql7.freesqldatabase.com",
    "database": "sql7142604",
    "user": "sql7142604",
    "password": "myR6XCKIh5",
    "dbport": 3306,
    "port":  process.env.PORT || 3000,
    "max-connections": 250
}; */

//Local
module.exports = {
    "host": process.env.host,
    "database": process.env.dbName,
    "user": process.env.dbUser,
    "password": process.envdbPwd,
    "dbport": 3306,
    "port":  process.env.PORT || 3000,
};

