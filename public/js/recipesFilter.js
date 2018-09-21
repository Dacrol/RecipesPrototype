class RecipesFilter {
  constructor() {
    this.filterBy = []
  }


 

  renderAllRecipes() {
    db.collection('Recipes')
      .get()
      .then(querySnapshot => {
        Promise.all(querySnapshot.docs.map(doc => doc.data())).then(
          this.renderRecipes
        )
      })
  }

  renderRecipes(recipes) {
    $('#recipe-list').empty()
    recipes.forEach(recipe => {
      $('#recipe-list')
        .append(`<div class="col-12 col-md-6 col-xl-4 mb-5"><a href="/recipe/${formatUrl(
        recipe.dish
      )}">
  <div id="${recipe.dish}" class="card h-100 mb-4 shadow-sm">
    <img class="card-img-top recipe-thumbnail" alt="${recipe.dish}" src="${
        recipe.image
      }">
    <div class="card-body d-flex flex-column justify-content-between">
      <p class="card-text">${recipe.summary}</p>
      <div class="d-flex justify-content-between align-items-center">
        <i class="far fa-clock fa-1point5"></i>
        <small class="text-muted">${recipe.time}</small>
      </div>
    </div>
  </div>
  </div></a>`)
    })
  }
}

const recipesFilter = new RecipesFilter()
recipesFilter.renderAllRecipes()

;(function addIngredientsToSidebar() {
  db.collection('Recipes')
    .get()
    .then(recipes => {
      const existingIngredients = new Set()
      recipes.forEach(recipe => {
        recipe.data().ingredients.forEach(ingredient => {
          existingIngredients.add((ingredient.name))
        })
      })
      Array.from(existingIngredients)
        .sort()
        .forEach(ingredient => {
          $('#ingredients-list').append(`<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" data-ingredient="${ingredient}" id="${formatUrl(
            ingredient
          )}">
  <label class="form-check-label" for="${formatUrl(ingredient)}">
    ${capitalizeFirstLetter(ingredient)}
  </label>
</div>`)
        })
    })
})()

// Make sure scrollbar is hidden even if it's not 17px wide
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
