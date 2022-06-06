//Using the express function
//We now know why we're using express.  This is mostly used for the .get function.  Without it, no function at all.  
const router = require('express').Router();
//Using the category
//There's something to note:  The double .. . Before, we had something like this: ./routes.  What we're doing is POPPING back up a level when we do ../ .  Notice, however, that we are doing it TWO TIMES.  We're currently in the 'api' folder.  What happens is that by doing ../, we are going to the 'routes' folder, but since we're doing it twice, we're getting out of the 'routes' folder as well.  That then puts us in the config folder.

//Now that we established this, we then look at the next thing:  'models'.  Using what we learned last time, this is now directing to the 'models' folder.  So now with the const { Catagory, Product } being defined, we're going to use whatever the 'models' folder is.
const { Category, Product } = require('../../models');


//Now that we have this next part established, we then turn our attention to what the above line is suppose to do.  From what I could tell, we have a folder that has 'models' in it.  In that same folder, we have the following:  Category.js, index.js, Product.js, ProductTag.js, and Tag.js.  I've noticed that there is both Category AND Product on that line, meaning we're linking it?


// The `/api/categories` endpoint


//Currently, we're in localhost:3001/api WITH the folder of 'api'.

//With this statement, we're defining localhost.3001/api/
router.get('/', (req, res) => {
  // find all categories
  //An example of this now defines the following:  We're going to the route of the Category.  See the const defined to have /models, which is going to be the folder from the side
  Category.findAll ({
    //When we looked at Category, we have a category_name
    attributes: [`id`, `category_name`],
    // be sure to include its associated Products
    //This is in the model.js file
    include: [
      //It has product_name, price, stock, and category_id
      {
        //We have Product still, so we're going to define that
        model: Product,
        attributes: [`id`, `product_name`, `price`, `stock`, `category_id`]
      }
    ]

  })
  //Move this information to the CategoryData
  .then(CategoryData => res.json(CategoryData))
  //If there's an error, catch it!
  .catch(err=> {
    console.log(err);
    res.status(500).json(err);
  })

});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  Category.findOne({
    where: {
      id: req.params.id
    },
    attributes: [`id`, `categor_name`],
    include: [
      //It has product_name, price, stock, and category_id
      {
        // be sure to include its associated Products
        //We have Product still, so we're going to define that
        model: Product,
        attributes: [`id`, `product_name`, `price`, `stock`, `category_id`]
      }
    ]

  })
  .then(CategoryData => {
    if (!CategoryData)
    {
      res.status(404).json({message: 'No category found in this id!'});
      return;
    }
    res.json(CategoryData);
  })
  .catch(err=> {
    console.log(err);
    res.status(500).json(err);
  })


});

router.post('/', (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name
  })
  .then(CategoryData => res.json(CategoryData))
  .catch(err=> {
    console.log(err);
    res.status(500).json(err);
  })

});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(CategoryData => {
    if(!CategoryData)
    {
      res.status(404).json({ message: 'No Category found with this id!'});
      return;  
    }
    res.json(CategoryData);
  })
  .catch(err=> {
    console.log(err);
    res.status(500).json(err);
  })
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id
    }

  })
  .then(CategoryData => {
    if (!CategoryData){
      res.status(404).json({ message: 'No category found in this id!'});
      return;
    }
    res.json(CategoryData);
  })
  .catch(err=> {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;
