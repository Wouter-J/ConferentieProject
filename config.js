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

module.exports = {
    "database": "mydb",
    "user": "root",
    "password": "",
    "dbport": 3306,
    "port":  process.env.PORT || 3000,
};

//Local
module.exports = {
    "database": process.env.dbName,
    "user": process.env.dbUser,
    "password": process.envdbPwd,
    "dbport": 3306,
    "port":  process.env.PORT || 3000,
};
