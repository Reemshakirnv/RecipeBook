
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
const recipeSchema = new mongoose.Schema({
  name: String,
  category: String,
  time: String,
  image: String,
  ingredients: String,
  instructions: String
})

const Recipe = mongoose.model('Recipe', recipeSchema)
app.get('/api/recipes', async (req, res) => {
  const recipes = await Recipe.find()
  res.json(recipes)
})
app.post('/api/recipes', async (req, res) => {
  const recipe = await Recipe.create(req.body)
  res.json(recipe)
})
app.put('/api/recipes/:id', async (req, res) => {
  const recipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  res.json(recipe)
})
app.delete('/api/recipes/:id', async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id)
  res.json({ message: 'Recipe deleted successfully' })
})
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')
    app.listen(5000, () => {
      console.log('Server running at http://localhost:5000')
    })
  })
  .catch(error => {
    console.log('MongoDB connection error:', error.message)
  })
