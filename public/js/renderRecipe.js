let dishName = location.pathname;
let selectedDish;
let livsmedel;
let livsmedelsNamn = 'Lasagne';
let selectedNumberOfPortions;
let defaultSelectedNumberOfPortions;


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

  defaultSelectedNumberOfPortions = selectedDish.portions;
  selectedNumberOfPortions = defaultSelectedNumberOfPortions;

  $('#recipe-details')
    .append(`<section class="d-flex flex-column justify-content-start align-items-stretch w-maxlg-100" id="recipe-ingredients" alt="">
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
      }</span><span id="printrecipe" class="instructions-icons btn-print"><i class="fas fa-print"></i> Skriv ut</span>
    <a class="no-blue" href="/shoppinglist"><span class="instructions-icons shopping-list"><i class="fas fa-clipboard-list"></i> Handla allt</span></span></a>
      </div>
    </div>
      <div class="instructions-body-area d-flex flex-fill container">
        <div class="align-self-start d-flex flex-column">
          <h4 class="mt-3 ml-3 mb-3">Tillagning:</h4>
          <ol class="instruction-list mr-3">
          ${renderInstructions()}
          </ol>
        <h4 class="mt-4 ml-3 mb-3">Näringsinnehåll/100g</h4>
        <div class="d-flex flex-wrap nutrition-table ml-4 mb-5">
           
        </div>
      </div>
    </div>
    `)
  $('#portion-size').val(defaultSelectedNumberOfPortions);
  $('#ingredient-list').append(renderIngredients());


  let img = $('section img').get(0);
  img.addEventListener('load', function () {
    const vibrant = new Vibrant(img);
    const swatches = vibrant.swatches()
    // console.log(swatches)
    if (swatches.LightVibrant) {
      $('.gradient-background').css({ background: `linear-gradient(to bottom, ${swatches.LightVibrant.getHex()}32, #ffffff00` })
      $('.solid-background').css({ backgroundColor: `${swatches.LightVibrant.getHex()}32` })
    }
    else if (swatches.Muted) {
      $('.gradient-background').css({ background: `linear-gradient(to bottom, ${swatches.Muted.getHex()}32, #ffffff00` })
      $('.solid-background').css({ backgroundColor: `${swatches.Muted.getHex()}32` })
    }
    /*
     * Results into:
     * Vibrant #7a4426
     * Muted #7b9eae
     * DarkVibrant #348945
     * DarkMuted #141414
     * LightVibrant #f3ccb4
     */
  });

}

function renderInstructions() {
  let html = ''
  selectedDish.description.forEach(instruction => {
    html += `<li>${instruction}</li>`
  })
  return html
}

function renderIngredients() {
  let html = $(`<div id="cartform" class="form-check">`);
  
  selectedDish.ingredients.forEach(ingredient => {
    ingredientamount = ingredient.amount / defaultSelectedNumberOfPortions;
    ingredientamount = ingredientamount * selectedNumberOfPortions;
    let newelement

    if (!ingredientamount) {
      newelement = $(`<li><input class="form-check-input" type="checkbox" value="${ingredient.name}" id="${ingredient.name}">${ingredient.name}</li>`)
      newelement.children('input').data('ingredient', ingredient);
      html.append(newelement);
    }
    else {
      newelement = $(`<li><input class="form-check-input" type="checkbox" value="${ingredient.name}" id="${ingredient.name}">${ingredient.unit === 'st' ? Math.round(ingredientamount) : ingredientamount} ${ingredient.unit} ${ingredient.name}</li>`)

      newelement.children('input').data('ingredient', ingredient);
      html.append(newelement);
    }
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
  let html = '';
  selectedDish.ingredients.forEach(ingredient => {
    if (ingredient.amount == '' || ingredient.amount == null) {
      html += `${ingredient.name}`
    } else
      html += `${ingredient.amount} ${ingredient.unit} ${ingredient.name}`
  });
  html += '<i class="fas fa-print" onclick="window.print();return false;"></i>'
  return html
};

$(document).on('click', '.shopping-list', function (e) {
  e.preventDefault();
  if (selectedNumberOfPortions === defaultSelectedNumberOfPortions) {
    localStorage.setItem('shoppinglist', JSON.stringify(selectedDish.ingredients));
  }
  else {
    localStorage.setItem('shoppinglist', JSON.stringify(selectedDish.ingredients.map(ingredient => {
      let ingredientamount = ingredient.amount / defaultSelectedNumberOfPortions;
      ingredientamount = ingredientamount * selectedNumberOfPortions;
      ingredient.amount = ingredientamount;
      return ingredient;
    })));
  };
  window.location.href = '/shoppinglist'
}
);

$(document).on('click', '#printrecipe', function (e) {
  e.preventDefault
  printData();
})

$(document).on('click', '#addtocart', function (e) {
  e.preventDefault
  submitForm();
  window.location.href = '/shoppinglist';
})

$(document).on('change', '#portion-size', function () {
  selectedNumberOfPortions = document.getElementById('portion-size').value;
  let newHtml = renderIngredients();
  $('#ingredient-list').empty();
  $('#ingredient-list').append(newHtml);
})

function submitForm() {
  if (selectedNumberOfPortions === defaultSelectedNumberOfPortions) {
    localStorage.setItem('shoppinglist', JSON.stringify($('#cartform input:checked').map((index, element) => $(element).data('ingredient')).get()));
  }
  else {

    localStorage.setItem('shoppinglist', JSON.stringify($('#cartform input:checked').map((index, element) => $(element).data('ingredient')).get().map(ingredient => {
      let ingredientamount = ingredient.amount / defaultSelectedNumberOfPortions;
      ingredientamount = ingredientamount * selectedNumberOfPortions;
      ingredient.amount = ingredientamount
      return ingredient
    }
    )));
  }
}

renderNutrition(livsmedelsNamn);

async function renderNutrition(livsmedelsNamn) {
  livsmedel = (await db
    .collection('Näringsinnehåll')
    .doc(livsmedelsNamn)
    .get()).data();

  // console.log(livsmedel);
  // console.log('Fett', livsmedel['Fett (g)']);
  // console.log('Salt', livsmedel['Salt (g)']);
  // console.log('Protein', livsmedel['Protein (g)'])
  // console.log('Kolhydrater', livsmedel['Kolhydrater (g)'])

  let html = $('.nutrition-table').append(`<div class="pr-2">Kolhydrater <span class="float-right">${livsmedel['Kolhydrater (g)']} g</span></div> 
    <div class="pr-2">Protein <span class="float-right">${livsmedel['Protein (g)']} g</span></div> 
    <div class="pr-2">Mättat fett<span class="float-right">${livsmedel['Fett (g)']} g</span></div> 
    <div class="pr-2">Enkelomättat fett<span class="float-right">15g</span></div> 
    <div class="pr-2">Fleromättat fett<span class="float-right">15g</span></div> 
    <div class="pr-2">Salt <span class="float-right">${livsmedel['Salt (g)']} g</span></div>  
    `);
  return html;
}


// förkortningar att filtrera/söka på om vi använder oss utav livsmedel.json istället
// Kolh
// Prot
// Mfet
// Mone
// Pole
// NaCl