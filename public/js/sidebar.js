const existingIngredients = new Set()

db.collection('Recipes')
  .get()
  .then(recipes => {
    recipes.forEach(recipe => {
      recipe.data().ingredients.forEach(ingredient => {
        existingIngredients.add(capitalizeFirstLetter(ingredient.name))
      })
    })
    existingIngredients.forEach(ingredient => {
      $('#ingredients-list').append(`
    <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="${formatUrl(
                      ingredient
                    )}">
                    <label class="form-check-label" for="${formatUrl(
                      ingredient
                    )}">
                      ${ingredient}
                    </label>
                  </div>`)
    })
  })

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
