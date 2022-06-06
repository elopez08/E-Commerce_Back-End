# E-commerce Back End Starter Code



AS A manager at an internet retail company
I WANT a back end for my e-commerce website that uses the latest technologies
SO THAT my company can compete with other e-commerce companies

GIVEN a functional Express.js API

WHEN I add my database name, MySQL username, and MySQL password to an environment variable file
THEN I am able to connect to a database using Sequelize
WHEN I enter schema and seed commands
THEN a development database is created and is seeded with test data
WHEN I enter the command to invoke the application
THEN my server is started and the Sequelize models are synced to the MySQL database
WHEN I open API GET routes in Insomnia for categories, products, or tags
THEN the data for each of these routes is displayed in a formatted JSON
WHEN I test API POST, PUT, and DELETE routes in Insomnia
THEN I am able to successfully create, update, and delete data in my database



One of the first things I did before anything else is following the route of the program.  After having to do multiple codes, I did had a good idea on how this is going to go.  It all starts with the server.js


The thing that surprised me the most was the 'express' function.  I didn't know when to use this, but right away, we have it set here.  It is defined as the app, which is letting me know that whenever we have to do something for the localhost, we need express.

The next thing that I noticed right away is the PORT being defined here.  It is being defined as 3001, which means that if we were to use the localhost, make sure to include the server number being 3001.  app is also used in the json to initiate the server.  There's also a usage going on on the routes, which tells me that it is using the 'route's folder.  So we'll follow that.

When we go to the folder, we noticed that the first thing being defined is the index.js.  I believe this is what causes it to default itself.  Inside the index.js, we have a few more routes being linked:  express again with the router and we have the api.  This is the folder that contains "api".  Now if we were to do localhost:3001, it's going to default the routes:  "WRONG ROUTE!".  The link is incorrect.  I also noticed that localhost:3001/api is ALSO incorrect seeing as it isn't being defined anything, therefore, it leads to this routes and it's ALSO incorrect.


