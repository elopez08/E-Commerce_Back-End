const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  Tag.findAll({
    attributes: [`id`, `tag_name`],

    // be sure to include its associated Product data
    include: [
      {
        model: Product,
        attributes: [`id`, `product_name`, `price`, `stock`, `category_id`]
      }
    ]
  })
  .then(TagData => res.json(TagData))
  .catch (err=> {
    console.log(err);
    res.status(500).json(err);
  })
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  Tag.findOne({
    where: {
      id: req.params.id
    },
    attributes: [`id`, `tag_name`],

    // be sure to include its associated Product data
    include: [
      {
        model: Product,
        attributes: [`id`, `product_name`, `price`, `stock`, `category_id`]
      }
    ]

  })
  .then(TagData => {
    if (!TagData)
    {
      res.status(404).json({message: 'No category found in this id!'});
      return;
    }
    res.json(TagData);
  })
  .catch(err=> {
    console.log(err);
    res.status(500).json(err);
  })
  // be sure to include its associated Product data
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
    tag_name: req.body.tag_name
  })
  .then(TagData => res.json(TagData))
  .catch(err=> {
    console.log(err);
    res.status(500).json(err);
  })

});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }

  })
  .then(TagData => {
    if(TagData)
    {
      res.status(404).json({ message: 'No Category found with this id!'});
      return;  
    }
    res.json(TagData);
  })
  .catch(err=> {
    console.log(err);
    res.status(500).json(err);
  })
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id
    }

  })
  .then(TagData => {
    if (!TagData){
      res.status(404).json({ message: 'No category found in this id!'});
      return;
    }
    res.json(TagData);
  })
  .catch(err=> {
    console.log(err);
    res.status(500).json(err);
  })
});

module.exports = router;
