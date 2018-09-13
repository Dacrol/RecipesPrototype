let dishName = 'Pad Thai';
let allDishes = [];
let selectedDish = [];
// let selectedDishID = '';

function loadAllDishes() {
return $.getJSON('./json/recipies.json', function (data) {
  data.forEach(recipe => allDishes.push(recipe));

  selectedDish = allDishes.filter(function (recipe) {
    return recipe.dish == dishName;
  });

  console.log('allDishes', allDishes)
  console.log(selectedDish[0].image)

});
};

loadAllDishes();
console.log('allDishes', allDishes)
renderDish();


async function renderDish() {
  selectedDish = await loadAllDishes();
  selectedDish = allDishes.filter(function (recipe) {
    return recipe.dish == dishName;
  })
  console.log('selectedDish',selectedDish)
  console.log(selectedDish[0].image)

  $('#recipe-details').append(`<div class="d-flex flex-column justify-content-start">
      <img class="" src="./${selectedDish[0].image}">
        <div class="">
          <select class="custom-select my-3" id="portion-size">
            <option selected>Antal portioner</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="1">4</option>
            <option value="2">5</option>
            <option value="3">6</option>
            <option value="1">7</option>
            <option value="2">8</option>
            <option value="3">9</option>
            <option value="1">10</option>
            <option value="2">11</option>
            <option value="3">12</option>
          </select>
        </div>
        <div class="mt-2">
          <ul id="ingredients">
            <li>Brunt socker</li>
            <li>Ljusbrunt socker</li>
            <li>Brunt socker</li>
            <li>Ljusbrunt socker</li>
            <li>Brunt socker</li>
            <li>Ljusbrunt socker</li>
            <li>Brunt socker</li>
            <li>Ljusbrunt socker</li>
          </ul>
        </div>
    </div>
  
    <div class="d-flex flex-column align-items-center flex-fill mx-5">
      <h1 class="mb-4">${selectedDish[0].dish}</h1>
      <span><i class="far fa-clock fa-1point5 mb-3"></i> ${selectedDish[0].time}<span> ${selectedDish[0].difficulty}</span></span>
      <h4 class="text-muted">${selectedDish[0].summary}</h4>
      <div class="align-self-start">
        <h4 class="mt-3">Instruktioner:</h4>
        <ol class="instruction-list">
          <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit, voluptatum facere? Ipsum atque aspernatur fuga architecto sequi ratione soluta ex qui ab, minima accusamus expedita quod natus cum at reiciendis.</li>
          <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus maxime dolores laboriosam voluptas dolore! Ipsum, recusandae, id neque nam consequatur unde dolore ullam nulla esse ea at sit? Tempore, perspiciatis!</li>
          <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit, voluptatum facere? Ipsum atque aspernatur fuga architecto sequi ratione soluta ex qui ab, minima accusamus expedita quod natus cum at reiciendis.</li>
          <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus maxime dolores laboriosam voluptas dolore! Ipsum, recusandae, id neque nam consequatur unde dolore ullam nulla esse ea at sit? Tempore, perspiciatis!</li>
          <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit, voluptatum facere? Ipsum atque aspernatur fuga architecto sequi ratione soluta ex qui ab, minima accusamus expedita quod natus cum at reiciendis.</li>
          <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus maxime dolores laboriosam voluptas dolore! Ipsum, recusandae, id neque nam consequatur unde dolore ullam nulla esse ea at sit? Tempore, perspiciatis!</li>
          <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Velit, voluptatum facere? Ipsum atque aspernatur fuga architecto sequi ratione soluta ex qui ab, minima accusamus expedita quod natus cum at reiciendis.</li>
          <li>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus maxime dolores laboriosam voluptas dolore! Ipsum, recusandae, id neque nam consequatur unde dolore ullam nulla esse ea at sit? Tempore, perspiciatis!</li>
        </ol>
        <h4 class="mt-4">Näringsinnehåll</h4>
        <div class="d-flex flex-wrap nutrition-table">
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
};

//   function renderInstructions() {
//     let html = '';
//     selectedDish.description.forEach(instruction => {
//       html += (`<p>${instruction}</p>`);
//     });
//     console.log(html);
//     $('#instruction-list').append(html);
//   }



$(document).on('click', '#recipe-list .card', function () {
  dishName = $(this)[0].id;
  selectedDish = allDishes.filter(function (recipe) {
    return recipe.dish == dishName;

    console.log('selectedDish', selectedDish);
    console.log('dishName', dishName)
  })
  renderDish();
  // console.log('clicked dish', dishName)
  // console.log('$(this)[0].id', $(this)[0].id)
  //   console.log('selectedDishID', selectedDishID)

}) 
