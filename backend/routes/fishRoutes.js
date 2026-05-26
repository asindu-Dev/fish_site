app.get("/recommend", (req, res) => {
    const tempNum = temp ? Number(temp) : null;
const phNum = ph ? Number(ph) : null;
const tdsNum = tds ? Number(tds) : null;

    let sql = `
        SELECT f.*, p.*
        FROM fish f
        JOIN fish_parameters p ON f.id = p.fish_id
        WHERE 1=1
    `;

    let values = [];

    if (temp !== undefined && temp !== "") {
        sql += " AND p.temp_min <= ? AND p.temp_max >= ?";
        values.push(temp, temp);
    }

    if (ph !== undefined && ph !== "") {
        sql += " AND p.ph_min <= ? AND p.ph_max >= ?";
        values.push(ph, ph);
    }

    if (tds !== undefined && tds !== "") {
        sql += " AND p.tds_min <= ? AND p.tds_max >= ?";
        values.push(tds, tds);
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);
    });
});