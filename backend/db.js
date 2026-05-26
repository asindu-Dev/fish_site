const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "aquarium_db"
});

db.connect((err) => {
    if (err) {
        console.log("DB connection failed:", err);
    } else {
        console.log("MySQL connected");
    }
});

module.exports = db;