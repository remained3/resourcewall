const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM rates`;
    console.log(query);
    db.query(query)
      .then(data => {
        const rates = data.rows;
        res.json({ rates });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
