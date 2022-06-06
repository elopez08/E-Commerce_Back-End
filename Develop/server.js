
const express = require('express');
//This is pointing to the routes document.  When executed on app.use(routes), it traces towards that particular folder.  Since it doesn't detect anything else, it'll default to index.js

//Inspect the folder:  When going in routes, we see that the index.js is the first being called.  That's why when we do localhost:3001, it says "WRONG ROUTE" since in that file, it says to do that
const routes = require('./routes');
// import sequelize connection

const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
//We're doing this on localhost:3001.  Defining it here
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});