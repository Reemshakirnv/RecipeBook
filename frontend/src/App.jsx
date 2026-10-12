
import { useState, useEffect } from 'react'
import './App.css'

const API = 'http://localhost:5000/api/recipes'

function App() {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [category, setCategory] = useState('Breakfast')
  const [time, setTime] = useState('')
  const [ingredients, setIngredients] = useState('')
  const [instructions, setInstructions] = useState('')
  const [editingId, setEditingId] = useState(null)
  async function loadRecipes() {
    try {
      const response = await fetch(API)

      if (!response.ok) {
        throw new Error('Unable to load recipes')
      }

      const data = await response.json()
      setRecipes(data)
      setMessage('')
    } catch (error) {
      setMessage('Cannot connect to the backend. Please check that the server is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecipes()
  }, [])

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(search.toLowerCase())
  )

  
  function clearForm() {
    setName('')
    setCategory('Breakfast')
    setTime('')
    setIngredients('')
    setInstructions('')
    setEditingId(null)
    setShowForm(false)
  }

  async function saveRecipe(event) {
    event.preventDefault()
    setMessage('')

    const recipeData = {
      name: name.trim(),
      category,
      time: `${time} min`,
      image: '',
      ingredients: ingredients.trim(),
      instructions: instructions.trim()
    }

    try {
      const url = editingId
        ? `${API}/${editingId}`
        : API

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeData)
      })

      if (!response.ok) {
        throw new Error('Unable to save recipe')
      }

      await loadRecipes()
      clearForm()
      setMessage(editingId
        ? 'Recipe updated successfully!'
        : 'Recipe saved successfully!'
      )
    } catch (error) {
      setMessage('Could not save the recipe. Please check the backend.')
    }
  }
  function editRecipe(recipe) {
    setName(recipe.name)
    setCategory(recipe.category || 'Breakfast')
    setTime(parseInt(recipe.time, 10) || '')
    setIngredients(recipe.ingredients || '')
    setInstructions(recipe.instructions || '')
    setEditingId(recipe._id)
    setSelectedRecipe(null)
    setShowForm(true)
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  async function deleteRecipe(id) {
    const confirmed = window.confirm('Are you sure you want to delete this recipe?')

    if (!confirmed) return

    try {
      const response = await fetch(`${API}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Unable to delete recipe')
      }

      setSelectedRecipe(null)
      await loadRecipes()
      setMessage('Recipe deleted successfully!')
    } catch (error) {
      setMessage('Could not delete the recipe. Please check the backend.')
    }
  }
  function recipeImage(recipe) {
    const colors = {
      Breakfast: 'F8E8C8',
      Lunch: 'F3E2C7',
      Dinner: 'DDE8D7',
      Dessert: 'F2DCE2',
      Snacks: 'F7E9C7'
    }

    const background = colors[recipe.category] || 'E8EFE3'
    const title = encodeURIComponent(recipe.name || 'Recipe')

    return recipe.image ||
      `https://placehold.co/600x360/${background}/416747?text=${title}`
  }

  return (
    <div className="app">
      <header className="navbar">
        <a
          className="brand"
          href="#home"
          onClick={() => {
            setSelectedRecipe(null)
            setShowForm(false)
            setMessage('')
          }}
        >
          <span className="brand-icon">🍲</span>
          RecipeBook
        </a>

        <nav className="nav-links">
          <button
            type="button"
            onClick={() => {
              setSelectedRecipe(null)
              setShowForm(false)
              setMessage('')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRecipe(null)
              setShowForm(true)
              setMessage('')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Manage Recipes
          </button>
        </nav>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <p className="tagline">YOUR DAILY FOOD INSPIRATION</p>

            <h1>
              Discover recipes
              <br />
              you'll love.
            </h1>

            <p className="hero-description">
              Find your next favourite dish and bring delicious ideas
              to your kitchen.
            </p>

            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                setSelectedRecipe(null)
                setShowForm(false)
                document.getElementById('recipes')?.scrollIntoView({
                  behavior: 'smooth'
                })
              }}
            >
              Explore Recipes
            </button>
          </div>

          <div className="hero-illustration" aria-hidden="true">
            🥗
          </div>
        </section>

        {message && (
          <div
            className="notice"
            role="status"
          >
            {message}
          </div>
        )}

        {showForm ? (
          <section className="content form-section">
            <div className="section-heading">
              <div>
                <p className="tagline">SHARE SOMETHING DELICIOUS</p>
                <h2>{editingId ? 'Edit Recipe' : 'Add a New Recipe'}</h2>
                <p className="section-description">
                  Add the details below to save your recipe.
                </p>
              </div>
            </div>

            <form className="recipe-form" onSubmit={saveRecipe}>
              <label>
                Recipe Name
                <input
                  type="text"
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder="e.g. Chocolate Cake"
                  autoComplete="off"
                  required
                />
              </label>

              <label>
                Category
                <select
                  value={category}
                  onChange={event => setCategory(event.target.value)}
                >
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Dessert</option>
                  <option>Snacks</option>
                </select>
              </label>

              <label>
                Preparation Time (minutes)
                <input
                  type="number"
                  min="1"
                  value={time}
                  onChange={event => setTime(event.target.value)}
                  placeholder="e.g. 30"
                  required
                />
              </label>

              <label>
                Ingredients
                <textarea
                  value={ingredients}
                  onChange={event => setIngredients(event.target.value)}
                  placeholder="List the ingredients..."
                  required
                />
              </label>

              <label>
                Cooking Instructions
                <textarea
                  value={instructions}
                  onChange={event => setInstructions(event.target.value)}
                  placeholder="Explain how to prepare the dish..."
                  required
                />
              </label>

              <div className="form-actions">
                <button type="submit" className="primary-btn">
                  {editingId ? 'Update Recipe' : 'Save Recipe'}
                </button>

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={clearForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : selectedRecipe ? (
          <section className="content detail-section">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setSelectedRecipe(null)}
            >
              ← Back to Recipes
            </button>

            <article className="detail-card">
              <img
                className="detail-image"
                src={recipeImage(selectedRecipe)}
                alt={selectedRecipe.name}
              />

              <div className="detail-content">
                <span className="category">
                  {selectedRecipe.category}
                </span>

                <h1>{selectedRecipe.name}</h1>

                <p className="detail-time">
                  ⏱ Preparation time: {selectedRecipe.time}
                </p>

                <h2>Ingredients</h2>
                <p className="detail-text">
                  {selectedRecipe.ingredients}
                </p>

                <h2>Cooking Instructions</h2>
                <p className="detail-text">
                  {selectedRecipe.instructions}
                </p>

                <div className="form-actions">
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => editRecipe(selectedRecipe)}
                  >
                    Edit Recipe
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteRecipe(selectedRecipe._id)}
                  >
                    Delete Recipe
                  </button>
                </div>
              </div>
            </article>
          </section>
        ) : (
          <section className="content recipes-section" id="recipes">
            <div className="section-heading">
              <div>
                <p className="tagline">FIND SOMETHING DELICIOUS</p>
                <h2>Explore Our Recipes</h2>
                <p className="section-description">
                  Simple ideas for your next delicious meal.
                </p>
              </div>

              <button
                type="button"
                className="primary-btn"
                onClick={() => {
                  setShowForm(true)
                  setMessage('')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                + Add Recipe
              </button>
            </div>

            <input
              className="search"
              type="search"
              placeholder="Search recipes by name..."
              value={search}
              onChange={event => setSearch(event.target.value)}
              aria-label="Search recipes"
            />

            {loading ? (
              <p className="empty-state">Loading recipes...</p>
            ) : filteredRecipes.length > 0 ? (
              <div className="recipe-grid">
                {filteredRecipes.map(recipe => (
                  <article className="recipe-card" key={recipe._id}>
                    <img
                      className="recipe-image"
                      src={recipeImage(recipe)}
                      alt={recipe.name}
                      loading="lazy"
                    />

                    <div className="card-body">
                      <span className="category">
                        {recipe.category}
                      </span>

                      <h3>{recipe.name}</h3>

                      <p className="recipe-time">
                        ⏱ {recipe.time}
                      </p>

                      <div className="card-actions">
                        <button
                          type="button"
                          className="primary-btn"
                          onClick={() => {
                            setSelectedRecipe(recipe)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                        >
                          View Recipe
                        </button>

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() => editRecipe(recipe)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => deleteRecipe(recipe._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>

                <h3>
                  {search ? 'No matching recipes' : 'No recipes yet'}
                </h3>

                <p>
                  {search
                    ? 'Try another search term.'
                    : 'Add your first recipe to start your collection.'}
                </p>

                {!search && (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => setShowForm(true)}
                  >
                    + Add Your First Recipe
                  </button>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>RecipeBook © 2026</p>
        <p>Made with ❤️ for food lovers</p>
      </footer>
    </div>
  )
}

export default App
