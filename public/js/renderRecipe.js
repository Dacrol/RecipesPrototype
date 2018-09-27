let dishName = location.pathname
let selectedDish
let livsmedel
let livsmedelsNamn = 'Lasagne'
let selectedNumberOfPortions
let defaultSelectedNumberOfPortions

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

if (window.location.pathname.startsWith('/recipe')) {
  renderDish().then(renderNutrition)
}

async function renderDish() {
  selectedDish = (await db
    .collection('Recipes')
    .doc(formatUrl(dishName))
    .get()).data()

  defaultSelectedNumberOfPortions = selectedDish.portions
  selectedNumberOfPortions = defaultSelectedNumberOfPortions

  $('#recipe-details')
    .append(`<section class="d-flex flex-column justify-content-start align-items-stretch w-maxlg-100" id="recipe-ingredient-list" alt="">
  <img class="align-self-center w-maxlg-100 solid-background" src="${
    selectedDish.image
  }" alt="bild på maträtten ${selectedDish.dish}">
  <div class="solid-background">
    <select class="custom-select my-3" id="portion-size">
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
    <ul id="ingredient-list" class="ingredient-list">
    </ul>
  </div>
</section>

<div class="d-flex flex-column flex-fill ml-lg-4">
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
          }</span><span class="instructions-icons">
          <i class="far fa-star"></i>
          <i class="far fa-star ${!(selectedDish.difficulty.toLowerCase().startsWith('m') || selectedDish.difficulty.toLowerCase().startsWith('s')) ? 'icon-muted' : ''}"></i>
          <i class="far fa-star ${!(selectedDish.difficulty.toLowerCase().startsWith('s')) ? 'icon-muted' : ''}"></i>
          ${
          selectedDish.difficulty
          }</span><span id="printrecipe" class="instructions-icons btn-print"><i class="fas fa-print"></i> Skriv ut</span>
        <a class="no-blue" href="/shoppinglist"><span class="instructions-icons shopping-list"><i class="fas fa-clipboard-list"></i>
            Handla allt</span></span></a>
    </div>
  </div>
  <div class="instructions-body-area d-flex flex-fill container px-0 px-lg-2">
    <div class="align-self-start d-flex flex-column">
      <h4 class="mt-3 ml-3 mb-3">Tillagning:</h4>
      <ol class="instruction-list mr-lg-3">
        ${renderInstructions()}
      </ol>
      <h4 class="mt-4 ml-3 mb-3">Näringsinnehåll (per portion)</h4>
      <div class="ml-4 mb-3">
        <div id="primary-nutrition-table" class="d-flex flex-wrap nutrition-table ml-4 mb-3">
        </div>
        <button class="btn btn-outline-dark" type="button" data-toggle="collapse" data-target="#all-nutrition"
          aria-expanded="false" aria-controls="all-nutrition">
          Visa mer
        </button>
      </div>
      <div class="collapse" id="all-nutrition">
        <div class="ml-4 mb-3">
          <div id="secondary-nutrition-table" class="d-flex flex-wrap nutrition-table ml-4 mb-3">
          </div>
        </div>
      </div>
      <div class="ml-3 text-muted">
        <small>Näringsinnehållet är ungefärligt och beräknat endast utifrån kända ingredienser</small>
      </div>
    </div>
  </div>`)
  $('#portion-size').val(defaultSelectedNumberOfPortions)
  $('#ingredient-list').append(renderIngredients())

  let img = $('section img').get(0)
  img.addEventListener('load', function () {
    try {
      const vibrant = new Vibrant(img)
      const swatches = vibrant.swatches()
      // console.log(swatches)
      if (swatches.LightVibrant) {
        $('.gradient-background').css({
          background: `linear-gradient(to bottom, ${swatches.LightVibrant.getHex()}32, #ffffff00`
        })
        $('.solid-background').css({
          backgroundColor: `${swatches.LightVibrant.getHex()}32`
        })
      } else if (swatches.Muted) {
        $('.gradient-background').css({
          background: `linear-gradient(to bottom, ${swatches.Muted.getHex()}32, #ffffff00`
        })
        $('.solid-background').css({
          backgroundColor: `${swatches.Muted.getHex()}32`
        })
      }
    } catch (e) {
      $('.gradient-background').css({
        background: `linear-gradient(to bottom, rgba(176, 184, 222, 0.196), #ffffff00`
      })
      $('.solid-background').css({
        backgroundColor: `rgba(176, 184, 222, 0.196)`
      })
    }
    /*
     * Results into:
     * Vibrant #7a4426
     * Muted #7b9eae
     * DarkVibrant #348945
     * DarkMuted #141414
     * LightVibrant #f3ccb4
     */
  })
  return selectedDish
}

function renderInstructions() {
  let html = ''
  selectedDish.description.forEach(instruction => {
    html += `<li>${instruction}</li>`
  })
  return html
}

function renderIngredients() {
  let html = $(`<div id="cartform" class="form-check">`)

  selectedDish.ingredients.forEach(ingredient => {
    ingredientamount = ingredient.amount / defaultSelectedNumberOfPortions
    ingredientamount = ingredientamount * selectedNumberOfPortions
    let newelement

    if (!ingredientamount) {
      newelement = $(
        `<li><input class="form-check-input" type="checkbox" value="${
        ingredient.name
        }" id="${ingredient.name}">${ingredient.name}</li>`
      )
      newelement.children('input').data('ingredient', ingredient)
      html.append(newelement)
    } else {
      newelement = $(
        `<li><input class="form-check-input" type="checkbox" value="${
        ingredient.name
        }" id="${ingredient.name}">${
        ingredient.unit === 'st'
          ? Math.round(ingredientamount)
          : ingredientamount
        } ${ingredient.unit} ${ingredient.name}</li>`
      )

      newelement.children('input').data('ingredient', ingredient)
      html.append(newelement)
    }
  })
  html.append(
    `</div>
<div class="form-group row" style="margin-top: 0.2rem;">
  <div class="col-12" style="margin-left: -1.25rem;">
    <button id="addtocart" type="submit" class="btn border-primary mt-2">Handla valda</button>
  </div>
</div>
</form>`
  )
  return html
}

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

$(document).on('click', '.shopping-list', function (e) {
  e.preventDefault()
  if (selectedNumberOfPortions === defaultSelectedNumberOfPortions) {
    localStorage.setItem(
      'shoppinglist',
      JSON.stringify(selectedDish.ingredients)
    )
  } else {
    localStorage.setItem(
      'shoppinglist',
      JSON.stringify(
        selectedDish.ingredients.map(ingredient => {
          let ingredientamount =
            ingredient.amount / defaultSelectedNumberOfPortions
          ingredientamount = ingredientamount * selectedNumberOfPortions
          ingredient.amount = Math.round(ingredientamount);
          return ingredient
        })
      )
    )
  }
  window.location.href = '/shoppinglist'
})

$(document).on('click', '#printrecipe', function (e) {
  e.preventDefault
  window.print()
})

$(document).on('click', '#addtocart', function (e) {
  e.preventDefault
  submitForm()
  window.location.href = '/shoppinglist'
})

$(document).on('change', '#portion-size', function () {
  selectedNumberOfPortions = document.getElementById('portion-size').value
  let newHtml = renderIngredients()
  $('#ingredient-list').empty()
  $('#ingredient-list').append(newHtml)
})

function submitForm() {
  if (selectedNumberOfPortions === defaultSelectedNumberOfPortions) {
    localStorage.setItem(
      'shoppinglist',
      JSON.stringify(
        $('#cartform input:checked')
          .map((index, element) => $(element).data('ingredient'))
          .get()
      )
    )
  } else {
    localStorage.setItem(
      'shoppinglist',
      JSON.stringify(
        $('#cartform input:checked')
          .map((index, element) => $(element).data('ingredient'))
          .get()
          .map(ingredient => {
            let ingredientamount =
              ingredient.amount / defaultSelectedNumberOfPortions
            ingredientamount = ingredientamount * selectedNumberOfPortions
            ingredient.amount = ingredientamount
            return ingredient
          })
      )
    )
  }
}
