const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// ---------------- ROOT ----------------
app.get("/", (req, res) => {
    res.send("API is working");
});

// ---------------- SEARCH FISH (SUGGESTIONS) ----------------
app.get("/fish/search", (req, res) => {
    const q = req.query.q;

    if (!q) return res.json([]);

    const sql = `
        SELECT id, name, image_url
        FROM fish
        WHERE name LIKE ?
        LIMIT 5
    `;

    db.query(sql, [`%${q}%`], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

// ---------------- GET FISH BY NAME ----------------
app.get("/fish/:name", (req, res) => {
    const name = req.params.name;

    const sql = `
        SELECT f.id, f.name, f.description, f.image_url,
               p.temp_min, p.temp_max,
               p.ph_min, p.ph_max,
               p.tds_min, p.tds_max
        FROM fish f
        JOIN fish_parameters p ON f.id = p.fish_id
        WHERE LOWER(f.name) = LOWER(?)
    `;

    db.query(sql, [name], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "Fish not found" });
        }

        res.json(result[0]);
    });
});

// ---------------- RECOMMEND FISH BY TANK ----------------
app.get("/recommend", (req, res) => {
    const { temp, ph, tds } = req.query;

    const tempNum = temp ? Number(temp) : null;
    const phNum = ph ? Number(ph) : null;
    const tdsNum = tds ? Number(tds) : null;

    let sql = `
        SELECT f.name, f.image_url, f.description,
               p.temp_min, p.temp_max,
               p.ph_min, p.ph_max,
               p.tds_min, p.tds_max
        FROM fish f
        JOIN fish_parameters p ON f.id = p.fish_id
        WHERE 1=1
    `;

    let values = [];

    if (tempNum !== null && temp !== "") {
        sql += " AND p.temp_min <= ? AND p.temp_max >= ?";
        values.push(tempNum, tempNum);
    }

    if (phNum !== null && ph !== "") {
        sql += " AND p.ph_min <= ? AND p.ph_max >= ?";
        values.push(phNum, phNum);
    }

    if (tdsNum !== null && tds !== "") {
        sql += " AND p.tds_min <= ? AND p.tds_max >= ?";
        values.push(tdsNum, tdsNum);
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

// ---------------- TEST DB ----------------
app.get("/test-db", (req, res) => {
    db.query("SELECT 1", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// ---------------- START SERVER ----------------
const PORT = 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});