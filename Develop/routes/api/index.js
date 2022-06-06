//This is the one that's defining which path to take.  Notice that there's a /categories in it.  So in example if we were to run the following:

    //localhost:3001/api/categories

//We're going to the root of that said folder.  Which means we need to look at what is in the categories section

const router = require('express').Router();
const categoryRoutes = require('./category-routes');
const productRoutes = require('./product-routes');
const tagRoutes = require('./tag-routes');

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/tags', tagRoutes);

module.exports = router;
