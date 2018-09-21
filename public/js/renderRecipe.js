let dishName = location.pathname
let selectedDish

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
  renderDish()
}

async function renderDish() {
  selectedDish = (await db
    .collection('Recipes')
    .doc(formatUrl(dishName))
    .get()).data()

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
          <ul id="ingredient-list" class="ingredient-list">
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
    <a class="no-blue" href="/shoppinglist"><span class="instructions-icons shopping-list"><i class="fas fa-clipboard-list"></i> Handla allt</span></span></a>
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
    $('#ingredient-list').append(renderIngridients());
}

function renderInstructions() {
  let html = ''
  selectedDish.description.forEach(instruction => {
    html += `<li>${instruction}</li>`
  })
  return html
}

function renderIngridients() {
  let html = $(`<div id="cartform" class="form-check">`);
  
  // selectedDish.ingredients.forEach(ingredient => {
  //   html += `<li>${ingredient.amount} ${ingredient.unit} ${ingredient.name}</li>`
  // })

  selectedDish.ingredients.forEach(ingredient => {
    let newelement = $(`<li><input class="form-check-input" type="checkbox" value="${ingredient.name}" id="${ingredient.name}">${ingredient.amount} ${ingredient.unit} ${ingredient.name}</li>`
  )
  newelement.children('input').data('ingredient', ingredient);
  html.append(newelement);
});
  html.append(`</div><div class="form-group row"><div class="col-sm-10"><button id="addtocart" type="submit" class="btn border-primary mt-2">Handla valda</button></div></div></form>`);
  return html;
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

function renderIngredientList() {
  let html = ''

  selectedDish.ingredients.forEach(ingredient => {
    if (ingredient.amount == '' || ingredient.amount == null) {
      html += `${ingredient.name}`
    } else
      html += `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`
  })

  html += '<i class="fas fa-print" onclick="window.print();return false;"></i>'
  return html
}

$(document).on('click', '.shopping-list', function(e) {
  e.preventDefault
  let html = renderIngredientList()
  localStorage.setItem('shoppinglist', JSON.stringify(selectedDish.ingredients));
  window.location.href = '/shoppinglist'
})

$(document).on('click', '#addtocart', function(e) {
  e.preventDefault
  submitForm();
  window.location.href = '/shoppinglist';
})

function submitForm(){
  localStorage.setItem('shoppinglist', JSON.stringify($('#cartform input:checked').map((index, element) => $(element).data('ingredient')).get()));
  }