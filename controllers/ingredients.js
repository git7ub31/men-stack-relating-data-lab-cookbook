const express = require('express');
const router = express.Router();
const Ingredient = require('../models/ingredient');

// Index 
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.render('ingredients/index', { ingredients });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// New 
router.get('/new', (req, res) => {
  res.render('ingredients/new');
});

// Create 
router.post('/', async (req, res) => {
  try {
    const newIngredient = new Ingredient({ name: req.body.name });
    await newIngredient.save();
    res.redirect('/ingredients');
  } catch (err) {
    console.error(err);
    res.redirect('/ingredients');
  }
});

// Show 
router.get('/:ingredientId', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.ingredientId);
    res.render('ingredients/show', { ingredient });
  } catch (err) {
    console.error(err);
    res.redirect('/ingredients');
  }
});

// Edit 
router.get('/:ingredientId/edit', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.ingredientId);
    res.render('ingredients/edit', { ingredient });
  } catch (err) {
    console.error(err);
    res.redirect('/ingredients');
  }
});

// Update 
router.put('/:ingredientId', async (req, res) => {
  try {
    await Ingredient.findByIdAndUpdate(req.params.ingredientId, { name: req.body.name });
    res.redirect(`/ingredients/${req.params.ingredientId}`);
  } catch (err) {
    console.error(err);
    res.redirect('/ingredients');
  }
});

// Delete 
router.delete('/:ingredientId', async (req, res) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.ingredientId);
    res.redirect('/ingredients');
  } catch (err) {
    console.error(err);
    res.redirect('/ingredients');
  }
});

module.exports = router;
