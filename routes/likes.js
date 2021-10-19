const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM likes`;
    console.log(query);
    db.query(query)
      .then(data => {
        const likes = data.rows;
        res.json({ likes });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
