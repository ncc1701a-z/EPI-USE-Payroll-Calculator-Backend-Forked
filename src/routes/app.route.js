import express from 'express';

const index = express.Router();

/* GET home page. */
index.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

export { index };
