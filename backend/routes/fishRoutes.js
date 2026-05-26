const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:name", (req, res) => {
    const name = req.params.name;

    const sql = `
        SELECT f.*, p.*
        FROM fish f
        JOIN fish_parameters p ON f.id = p.fish_id
        WHERE LOWER(f.name) = LOWER(?)
    `;

    db.query(sql, [name], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length === 0) {
            return res.status(404).json({ message: "Fish not found" });
        }

        res.json(result[0]);
    });
});

router.get("/recommend", (req, res) => {
    const { temp, ph, tds } = req.query;

    const sql = `
        SELECT f.name, f.image_url, p.*
        FROM fish f
        JOIN fish_parameters p ON f.id = p.fish_id
        WHERE ? BETWEEN p.temp_min AND p.temp_max
          AND ? BETWEEN p.ph_min AND p.ph_max
          AND ? BETWEEN p.tds_min AND p.tds_max
    `;

    db.query(sql, [temp, ph, tds], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json(result);
    });
});

module.exports = router;