class RecipesFilter {
  constructor() {
    this.filterByIngredients = []
    this.filterByTime = []
    this.filterByType = []
  }

  renderFiltered(ingredients) {
    // console.log(ingredients)
    if (Array.isArray(ingredients)) {
      this.filterByIngredients = ingredients
    }
    // console.log(this.filterBy)
    if (
      this.filterByIngredients.length +
        this.filterByTime.length +
        this.filterByType.length >
      0
    ) {
      let collection = db.collection('Recipes')
      let potentialRecipes =
        this.filterByIngredients.length > 0
          ? collection.where(
              'ingredientNames',
              'array-contains',
              this.filterByIngredients[0]
            )
          : collection
      potentialRecipes.get().then(snapshot => {
        const recipes = snapshot.docs.map(docs => docs.data())
        // console.log(recipes)
        let filteredRecipes = recipes.filter(recipe => {
          return this.filterByIngredients.every(ingredient => {
            return recipe.ingredientNames.includes(ingredient)
          })
        })
        if (this.filterByTime.length > 0) {
          filteredRecipes = filteredRecipes.filter(recipe => {
            return this.filterByTime.includes(recipe.time)
          })
        }
        if (this.filterByType.length > 0) {
          filteredRecipes = filteredRecipes.filter(recipe => {
            return this.filterByType.every(tag => {
              return recipe.tags.includes(tag)
            })
          })
        }
        // console.log(filteredRecipes)
        this.renderRecipes(filteredRecipes)
      })
    } else {
      this.renderAllRecipes()
    }
  }

  renderAllRecipes() {
    let collection = db.collection('Recipes')

    collection.get().then(querySnapshot => {
      Promise.all(querySnapshot.docs.map(doc => doc.data())).then(recipes => {
        if (location.pathname.startsWith('/search/')) {
          this.renderRecipes(
            recipes.filter(recipe =>
              recipe.dish
                .toLowerCase()
                .includes(
                  location.pathname.substr(
                    location.pathname.lastIndexOf('/') + 1
                  )
                )
            )
          )
        } else {
          this.renderRecipes(recipes)
        }
      })
    })
  }

  renderRecipes(recipes) {
    $('#recipe-list').empty()
    recipes.forEach(recipe => {
      $('#recipe-list')
        .append(`<div class="col-12 col-md-6 col-xl-4 mb-5"><a href="/recipe/${formatUrl(
        recipe.dish
      )}">
  <div id="${recipe.dish}" class="card h-100 mb-4 shadow-sm" >
    <div class="card-body d-flex flex-column justify-content-end" style="background-image: linear-gradient(to bottom, #00000000, #00000000, #0000004f, #000000c2, #000000e0), url(${
      recipe.image
    });">
      <div class="filler"></div>
      <h5 class="card-text">${recipe.dish}</h5>
      <p class="card-text">${recipe.summary}</p>
      <div class="d-flex justify-content-between align-items-center">
        <i class="text-muted far fa-clock fa-1point5"></i>
        <small class="text-muted">${recipe.time}</small>
      </div>
    </div>
  </div>
  </div></a>`)
      /* <img class="card-img-top recipe-thumbnail" alt="${recipe.dish}" src="${
        recipe.image
      }">    
  */
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
      const existingTimes = new Set()
      const existingTypes = new Set()
      recipes.forEach(recipe => {
        const recipeData = recipe.data()
        recipeData.ingredientNames.forEach(ingredient => {
          existingIngredients.add(ingredient)
        })
        existingTimes.add(recipeData.time)
        recipeData.tags.forEach(tag => {
          existingTypes.add(tag)
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
      Array.from(existingTimes)
        .sort()
        .forEach(time => {
          $('#time-list').append(`<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="${time.replace(
    /\s/g,
    ''
  )}" data-time="${time}">
  <label class="form-check-label" for="${time.replace(/\s/g, '')}">
    ${time.replace(/min/g, 'minuter')}
  </label>
</div>`)
        })
        Array.from(existingTypes)
        .sort()
        .forEach(type => {
          $('#type-list').append(`<div class="form-check">
  <input class="form-check-input" type="checkbox" value="" id="${type.replace(
    /\s/g,
    ''
  )}" data-type="${type}">
  <label class="form-check-label" for="${type.replace(/\s/g, '')}">
    ${capitalizeFirstLetter(type)}
  </label>
</div>`)
        })
    })
})()

$('#ingredients-list').on('change', '.form-check-input', function(e) {
  e.stopPropagation()
  recipesFilter.renderFiltered(
    $('#ingredients-list input:checked')
      .map((index, element) => $(element).data('ingredient'))
      .get()
  )
})

$('#time-list').on('change', '.form-check-input', function(e) {
  e.stopPropagation()
  recipesFilter.filterByTime = $('#time-list input:checked')
    .map((index, element) => $(element).data('time'))
    .get()
  recipesFilter.renderFiltered()
})

$('#type-list').on('change', '.form-check-input', function(e) {
  e.stopPropagation()
  recipesFilter.filterByType = $('#type-list input:checked')
    .map((index, element) => $(element).data('type'))
    .get()
  recipesFilter.renderFiltered()
})

// Make sure scrollbar is hidden even if it's not 17px wide
$('#sidebar').on('shown.bs.collapse', function() {
  const collapsible = $('.sidebar-container').get(0)
  if (collapsible.offsetWidth - collapsible.clientWidth !== 17) {
    collapsible.style.width =
      350 - (collapsible.offsetWidth - collapsible.clientWidth) + 'px'
  }
})

// Handle emptying filters
$('.empty-filter').click(function(e) {
  $('#sidebar .form-check-input').prop('checked', false)
  recipesFilter.filterByIngredients = []
  recipesFilter.filterByTime = []
  recipesFilter.filterByType = []
  recipesFilter.renderAllRecipes()
})

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
