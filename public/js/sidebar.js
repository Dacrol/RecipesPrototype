db.collection('Recipes')
  .get()
  .then(recipes => {
    const existingIngredients = new Set()
    recipes.forEach(recipe => {
      recipe.data().ingredients.forEach(ingredient => {
        existingIngredients.add(capitalizeFirstLetter(ingredient.name))
      })
    })
    Array.from(existingIngredients).sort().forEach(ingredient => {
      $('#ingredients-list').append(`<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="${formatUrl(
    ingredient
  )}">
  <label class="form-check-label" for="${formatUrl(ingredient)}">
    ${ingredient}
  </label>
</div>`)
    })
  })

$('#sidebar').on('shown.bs.collapse', function() {
  const collapsible = $('.sidebar-container').get(0)
  if (collapsible.offsetWidth - collapsible.clientWidth !== 17) {
    collapsible.style.width =
      417 - (collapsible.offsetWidth - collapsible.clientWidth) + 'px'
  }
})

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
