const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const app = require('./app');

// const DB = "mongodb+srv://dev:TodolistApp2020!@appdevsg.bzvej.mongodb.net/pmware2";
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful! '));

const port = process.env.PORT || 9696;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
