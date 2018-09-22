// kvar att fixa
// när man tar bort ingrediens/instruktion måste de tas bort från respektive array
// när man lagt till ett recept ska alla fält nollställas
// enhet ska nollställas när man lagt till ingrediens
// referens till annans ingrediensmängd är inte inlagt alls
// fler taggar?
// rating, hur ska det funka?
// möjlighet att lägga till bild, vet ej hur
// måste gå att refaktorera en hel del
// css

let ingArr = [];
let instArr = [];

// Lägg till hela receptet
$(document).on('click', '.btn-add-recipe', function() {

    let newRecipeObj = {};

    let dishTitle = $('#title').val();
    if(dishTitle.length < 2){
      $('#title').val('');
      $('#title').attr('placeholder', 'Fyll i minst 2 bokstäver');
      $('#title').addClass('bg-danger');
      return;
    }
    else {
      newRecipeObj.dish = $('#title').val();
    }

    let searchTags = $(".checkboxes input:checkbox:checked").map(function(){
      return $(this).val();
    }).get();
    newRecipeObj.tags = searchTags;

    // att göra - lägga in bild
    newRecipeObj.image = "/imgs/veg-lasagne.jpg"

    newRecipeObj.difficulty = $('#difficulty').val();
    
    newRecipeObj.portions = $('#portion-size').val();
  
    newRecipeObj.time = $('#cooking-time').val() + " min";

    // att göra - hantera rating
    newRecipeObj.rating = 0;

    let dishSummary = $('#summary').val();
    if(dishSummary.length < 2){
      $('#summary').val('');
      $('#summary').attr('placeholder', 'Fyll i minst 2 bokstäver');
      $('#summary').addClass('bg-danger');
      return;
    }
    else {
      newRecipeObj.summary = $('#summary').val();
    }

    newRecipeObj.additionalInfo = $('#additional-info').val();

    if(instArr.length > 0) {
      newRecipeObj.description = instArr;
    }
    else {
      $('#instruction').addClass('darkFont');
      $('#instruction').attr('placeholder', 'Fyll i minst 1 instruktion');
      $('#instruction').addClass('bg-danger');
      return;
    }

    if(ingArr.length > 0) {
      newRecipeObj.ingredients = ingArr;
    }
    else {
      formCheck();
      return;
    }

    console.log(newRecipeObj);
    $('.add-success').toggleClass('d-none')
  });

// Visa/dölj ny inmatning för ingrediensmängder
$(document).on('click', '.btn-add-ingredient-info', function () {
  $('.added-ingredient-info').toggleClass('d-none');
  $('.btn-add-ingredient-info').toggleClass('fa-plus');
  $('.btn-add-ingredient-info').toggleClass('fa-minus');
  $('.add-reference').toggleClass('d-none');
  $('.hide-reference').toggleClass('d-none');
})
  
// Lägg till ny instruktion
$(document).on(' click', '.btn-add-instruction', function () {
  if ($('.add-instruction').val()) {
    $('.added-instructions').append(`
    <p class="btn-sub-instruction mt-2 ml-3 instruction-item"><i class="fas fa-minus" role="button"></i> ${$('.add-instruction').val()}</p>
  `)
  instArr.push($('.add-instruction').val());
  }
  $('.add-instruction').val('')
})

// Lägg till ingredienser

$(document).on('click', '.btn-add-ingredient', function () {
  if(!formCheck()){
    return;
  }
  $('.added-ingredient').append(`
    <p class="btn-sub-ingredient mt-2 ml-3 ingredient-item"><i class="fas fa-minus" role="button"></i> ${$('.typeahead-ingredients').val()} ${$(
    '.add-volume').val()} ${$('#add-unit').val()}/ ${$('.add-weight').val()}g</p>
  `)
  ingArr.push(`${$('.typeahead-ingredients').val()} ${$(
    '.add-volume').val()} ${$('#add-unit').val()}/${$('.add-weight').val()}g`);
  $('.typeahead-ingredients, .add-volume, .add-weight').val('')
})

// Kontrollera inmatning av ingredienser
function formCheck(){

// Kontroll av ingredienslängd
  let ingredientCheck = $('.typeahead-ingredients').val();
    if(ingredientCheck.length < 2){
      $('.typeahead-ingredients').val('');
      $('.typeahead-ingredients').attr('placeholder', 'Fyll i minst 2 bokstäver');
      $('.typeahead-ingredients').addClass('bg-danger');
      return false;
    }

  // Kontroll av antal
  let volumeCheck = $('.add-volume').val();
    if(volumeCheck.length < 1){
      $('.add-volume').val('');
      $('.add-volume').attr('placeholder', 'Fyll i minst 1 siffra');
      $('.add-volume').addClass('bg-danger');
      return false;
  } 

  // Kontroll av enhet
  let unitCheck = $('#add-unit').val();
  if(unitCheck == 'enhet'){
    $('#add-unit').addClass('bg-danger');
    return false;
  }

  // Kontroll av vikt
  let weightCheck = $('.add-weight').val();
    if(weightCheck.length < 1){
      $('.add-weight').val('');
      $('.add-weight').addClass('darkFont');
      $('.add-weight').attr('placeholder', 'Fyll i minst 1 siffra');
      $('.add-weight').addClass('bg-danger');
      return false;
  } 
  return true;
}


// Ta bort felmeddelande från inmatning
$('.typeahead-ingredients, #title, #summary, #instruction').focus(function(){
  $('.typeahead-ingredients, #title, #summary, #instruction').removeClass('bg-danger');
  $('.typeahead-ingredients').attr('placeholder', 'Ingrediens');
  $('#title').attr('placeholder', " T.ex. 'Pad Thai'");
  $('#summary').attr('placeholder', "T.ex. 'En fräsch och kryddig kycklingrätt med smak av lime, vitlök och ostronsås.'");
  $('#instruction').attr('placeholder', "T.ex. 'Skär kamelen i bitar innan du steker den i rikligt med smör'")
});

$('.add-volume').focus(function(){
  $('.add-volume').removeClass('bg-danger');
  $('.add-volume').attr('placeholder', ' Antal');
});

$('.add-weight').focus(function(){
  $('.add-weight').removeClass('bg-danger');
  $('.add-weight').attr('placeholder', ' Vikt i g');
});

$('#add-unit').focus(function(){
  $('#add-unit').removeClass('bg-danger');
})

// Ta bort från ingrediens- eller instruktions-lista
$(document).on('click', '.btn-sub-ingredient, .btn-sub-instruction', function(){
  $(this).remove();
})