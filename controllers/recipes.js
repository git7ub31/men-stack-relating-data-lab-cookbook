const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient');

// Index 
router.get('/', async (req, res) => {
    try {
      const recipes = await Recipe.find({ owner: req.session.user._id }).populate('ingredients');
      res.render('recipes/index.ejs', { recipes });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

router.get('/new', async (req, res) => {
  try {
      const ingredients = await Ingredient.find();
      
      res.render('recipes/new.ejs', { ingredients });
  } catch (error) {
      console.log(error);
      res.redirect('/');
  }
});  


// Create 
router.post('/', async (req, res) => {
  try {
      const { name, instructions, ingredients } = req.body;

      const newRecipe = new Recipe({
          name,
          instructions,
          ingredients,  
          owner: req.session.user._id,  
      });

      await newRecipe.save();

      res.redirect('/recipes');
  } catch (error) {
      console.log(error);
      res.redirect('/');
  }
});




// Show 
router.get('/:recipeId', async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients');
      res.render('recipes/show.ejs', { recipe });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });
  
// Edit 
router.get('/:recipeId/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients');
    const ingredients = await Ingredient.find();  
    res.render('recipes/edit.ejs', { recipe, ingredients }); 
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});  

// Update recipe
router.put('/:recipeId', async (req, res) => {
  try {
      const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.recipeId, req.body, { new: true });
      res.redirect(`/recipes/${updatedRecipe._id}`);
  } catch (error) {
      console.log(error);
      res.redirect('/');
  }
});

// Delete 
router.delete('/:recipeId', async (req, res) => {
    try {
      await Recipe.findByIdAndDelete(req.params.recipeId);
      res.redirect('/recipes');
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });
  
module.exports = router;
