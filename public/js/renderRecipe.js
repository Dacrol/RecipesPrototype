let dishName = location.pathname
let allDishes = []
let selectedDish = []

dishName = dishName
  .substr(dishName.lastIndexOf('/') + 1)
  .replace('%C3%B6', 'o')
  .replace('%C3%A4', 'a')
  .replace('%C3%A5', 'a')
  .replace(' ', '')
  .toLowerCase()

if (dishName === 'recipe') {
  dishName = 'padthai'
}

function loadAllDishes() {
  return $.getJSON('/json/recipes.json', function(data) {
    data.forEach(recipe => allDishes.push(recipe))

    // const dishObj = allDishes.map(dish =>
    //   dish.ingredients.map(i => i.split(' ')).map(i => {
    //     let obj ={ amount: i[0], unit: i[1], name: i.slice(2).join(' ') }
    //     if (obj.unit === 'g' || obj.unit === 'gram') {
    //       obj.mass = obj.amount
    //     } else {
    //       obj.mass = '?'
    //     }
    //     if (!obj.unit) {
    //       obj.unit = 'st'
    //     }
    //     return obj
    //   })
    // )
    // console.log(JSON.stringify(dishObj))
    // console.log(dishObj)

    selectedDish = allDishes.find(function(recipe) {
      return (
        recipe.dish
          .toLowerCase()
          .replace('å', 'a')
          .replace('ä', 'a')
          .replace('ö', 'o')
          .replace(' ', '') == dishName
      )
    })
  })
}

if (window.location.pathname.startsWith('/recipe')) {
  renderDish()
}

async function renderDish() {
  selectedDish = await loadAllDishes()
  selectedDish = allDishes.find(function(recipe) {
    return (
      recipe.dish
        .toLowerCase()
        .replace('å', 'a')
        .replace('ä', 'a')
        .replace('ö', 'o')
        .replace(' ', '') == dishName
    )
  })

  $('#recipe-details')
    .append(`<section class="d-flex flex-column justify-content-start align-items-stretch w-maxlg-100" alt="">
      <img class="align-self-center w-maxlg-100 solid-background" src="${
        selectedDish.image
      }" alt="bild på maträtten ${selectedDish.dish}">
        <div class="solid-background">
          <select class="custom-select my-3" id="portion-size">
            <option selected>Antal portioner</option>
            <option value="1">1 portion</option>
            <option value="2">2 portioner</option>
            <option value="3">3 portioner</option>
            <option value="4">4 portioner</option>
            <option value="5">5 portioner</option>
            <option value="6">6 portioner</option>
            <option value="7">7 portioner</option>
            <option value="8">8 portioner</option>
            <option value="9">9 portioner</option>
            <option value="10">10 portioner</option>
            <option value="11">11 portioner</option>
            <option value="12">12 portioner</option>
          </select>
        </div>
        <div class="pt-2 gradient-background">
          <p class="ml-3">Ingredienser:</p>
          <ul class="ingredient-list">
            ${renderIngridients()}
          </ul>
        </div>
    </section>
  
    <div class="d-flex flex-column flex-fill mx-5">
    <div class="instructions-header-area d-flex mb-3 mx-3">
      <div class="d-flex flex-column flex-fill">
        <h1 class="mb-2 mt-3 instruction-title text-center">${
          selectedDish.dish
        }</h1>
        <h4 class="instruction-summary mb-4 text-center">${
          selectedDish.summary
        }</h4>
        <span class="mb-4 text-center"><span class="instructions-icons mb-3"><i class="far fa-clock"></i> ${
          selectedDish.time
        }</span><span class="instructions-icons"><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star icon-muted"></i> ${
    selectedDish.difficulty
  }</span><span class="instructions-icons btn-print"><i class="fas fa-print"></i> Skriv ut</span>
    <a href="/shoppinglist"><span class="instructions-icons shopping-list"><i class="fas fa-clipboard-list"></i> Inköpslista</span></span></a>
      </div>
    </div>
      <div class="instructions-body-area d-flex flex-fill container">
        <div class="align-self-start d-flex flex-column">
          <h4 class="mt-3 ml-3 mb-3">Tillagning:</h4>
          <ol class="instruction-list mr-3">
          ${renderInstructions()}
          </ol>
        <h4 class="mt-4 ml-3 mb-3">Näringsinnehåll</h4>
        <div class="d-flex flex-wrap nutrition-table ml-4 mb-5">
          <div class="pr-2">
            Kolhydrater <span class="float-right">100g</span>
          </div>
          <div class="pr-2">
            Protein <span class="float-right">25g</span>
          </div>
          <div class="pr-2">
            Fett <span class="float-right">15g</span>
          </div>
          <div class="pr-2">
            Vitamin B <span class="float-right">0,4g</span>
          </div>
        </div>
      </div>
    </div>
    `)
}

function renderInstructions() {
  let html = ''
  selectedDish.description.forEach(instruction => {
    html += `<li>${instruction}</li>`
  })
  return html
}

function renderIngridients() {
  let html = ''
  selectedDish.ingredients.forEach(ingredient => {
    html += `<li>${ingredient.amount} ${ingredient.unit} ${
      ingredient.name
    }</li>`
  })
  return html
}

$(document).on('click', '#recipe-list .card', function() {
  dishName = $(this)[0].id
  selectedDish = allDishes.find(function(recipe) {
    return recipe.dish == dishName
  })
  renderDish()
})

function convertIngredientStringArray(ingredients) {
  return ingredients.map(i => convertIngredientString(i))
}

function convertIngredientString(ingredient) {
  const i = ingredient.split(' ')
  let obj = { name: i.slice(2).join(' '), amount: i[0], unit: i[1] }
  if (obj.unit === 'g' || obj.unit === 'gram') {
    obj.mass = obj.amount
  } else {
    obj.mass = '?'
  }
  if (!obj.unit) {
    obj.unit = 'st'
  }
  return obj
}

function renderShoppingList() {
  let html = ''

  selectedDish.ingredients.forEach(ingredient => {
    if (ingredient.amount == '' || ingredient.amount == null) {
      html += `<li><input type="checkbox" class="checkbox"><label>${
        ingredient.name
      }</label></input></li>`
    } else
      html += `<li><input type="checkbox" class="checkbox"><label>${
        ingredient.amount
      } ${ingredient.unit} ${ingredient.name}</label></input></li>`
  })

  html += '<i class="fas fa-print" onclick="window.print();return false;"></i>'
  return html
}

$(document).on('click', '.shopping-list', function(e) {
  e.preventDefault
  let html = renderShoppingList()
  localStorage.setItem('shoppinglist', html)
  window.location.href = '/shoppinglist'
})
