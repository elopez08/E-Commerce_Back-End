const router = require('express').Router();
const apiRoutes = require('./api');

//We're in localhost:3001

//By this definition, we're attempting to do localhost:3001/api
//Remember that the apiRoutes is the folder that we're using
router.use('/api', apiRoutes);

//When we do the router.use by default WITHOUT anything in relation, this is going to say 'Wrong Route'.  Notice that above there's another route.  We need to go to THAT route

//This route is for:  localhost:3001 and nothing else.  WRONG ROUTE

//I've also noticed that if we just do localhost:3001/api, it still points to this.
router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});

module.exports = router;