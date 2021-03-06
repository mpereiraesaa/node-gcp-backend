require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PORT = 8080 } = process.env;

const routes = require('./src/routes');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api', routes);

app.use((error, req, res, next) => {
  const { status = 500, message = 'Error', code = 500 } = error || {};

  return res.status(status).json({ message, code, status });
});

app.listen(PORT, (err) => {
  if (err) {
    console.err(err);
    process.exit(1);
  }

  console.log(`Server running at port: ${PORT}`);
});
