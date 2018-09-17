let dishName = 'Pad Thai'
let allDishes = []
let selectedDish = []
// let selectedDishID = '';

function loadAllDishes() {
  return $.getJSON('./json/recipies.json', function(data) {
    data.forEach(recipe => allDishes.push(recipe))

    selectedDish = allDishes.filter(function(recipe) {
      return recipe.dish == dishName
    })

    console.log('allDishes', allDishes)
    console.log(selectedDish[0].image)
  })
}

if (window.location.pathname.startsWith('/recipe')) {
  loadAllDishes()
  console.log('allDishes', allDishes)
  renderDish()
}

async function renderDish() {
  selectedDish = await loadAllDishes()
  selectedDish = allDishes.filter(function(recipe) {
    return recipe.dish == dishName
  })
  console.log('selectedDish', selectedDish)
  console.log(selectedDish[0].image)

  $('#recipe-details')
    .append(`<div class="d-flex flex-column justify-content-start align-items-stretch w-maxlg-100">
      <img class="align-self-center w-maxlg-100 solid-background" src="./${
        selectedDish[0].image
      }" alt="${selectedDish[0].dish}">
        <div class="solid-background">
          <select class="custom-select my-3" id="portion-size">
            <option selected>Antal portioner</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
        </div>
        <div class="pt-2 gradient-background">
          <p class="ml-3">Ingredienser:</p>
          <ul class="ingredient-list">
            <li>250 g risnudlar</li>
            <li>2 msk olja</li>
            <li>400 g strimlad kycklingfilé</li>
            <li>6 dl strimlad vitkål</li>
            <li>4 dl böngroddar</li>
            <li>2 msk ostronsås</li>
            <li>2 msk soja</li>
            <li>2 msk vatten</li>
            <li>1 msk fisksås</li>
            <li>1 lime, rivet skal och saft</li>
            <li>2 hackade vitlöksklyftor</li>
          </ul>
        </div>
    </div>
  
    <div class="d-flex flex-column flex-fill mx-5">
    <div class="instructions-header-area d-flex mb-3 mx-3">
      <div class="d-flex flex-column flex-fill">
        <h1 class="mb-2 mt-3 instruction-title text-center">${
          selectedDish[0].dish
        }</h1>
        <h4 class="instruction-summary mb-4 text-center">${
          selectedDish[0].summary
        }</h4>
        <span class="mb-4 text-center"><span class="instructions-icons mb-3"><i class="far fa-clock"></i> ${
          selectedDish[0].time
        }</span><span class="instructions-icons"><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star icon-muted"></i> ${
    selectedDish[0].difficulty
  }</span><span class="instructions-icons btn-print"><i class="fas fa-print"></i> Skriv ut</span><span class="instructions-icons"><i class="fas fa-clipboard-list"></i> Inköpslista</span></span>
      </div>
    </div>
      <div class="instructions-body-area d-flex flex-fill container">
        <div class="align-self-start d-flex flex-column">
          <h4 class="mt-3 ml-3 mb-3">Tillagning:</h4>
          <ol class="instruction-list mr-3">
            <li>Blanda alla ingredienser till såsen.</li>
            <li>Tillaga nudlarna enligt anvisning på förpackningen.</li>
            <li>Hetta upp olja i en rymlig stekpanna eller wok. Stek kycklingen på stark värme, cirka 2 minuter.</li>
            <li>Tillsätt sås, vitkål, böngroddar, nudlar och stek ytterligare 3 minuter under omrörning. Knäck i äggen. Vänd runt ordentligt tills äggen stelnat.</li>
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

//   function renderInstructions() {
//     let html = '';
//     selectedDish.description.forEach(instruction => {
//       html += (`<p>${instruction}</p>`);
//     });
//     console.log(html);
//     $('#instruction-list').append(html);
//   }

$(document).on('click', '#recipe-list .card', function() {
  dishName = $(this)[0].id
  selectedDish = allDishes.filter(function(recipe) {
    return recipe.dish == dishName

    console.log('selectedDish', selectedDish)
    console.log('dishName', dishName)
  })
  renderDish()
  // console.log('clicked dish', dishName)
  // console.log('$(this)[0].id', $(this)[0].id)
  //   console.log('selectedDishID', selectedDishID)
})
