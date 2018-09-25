// kvar att fixa

// skicka info till databasen
// ta bort ingredientNames och ingredients från andra referensens arrayer vid borttagning av ingrediens
// css glöm inte lägg till knapp inte responsiv

// fler taggar, vilka?
// rating, hur ska det funka?

// möjlighet att lägga till bild, vet ej hur
// bilden måste vara tabindexerad (som 1?!)

// måste gå att refaktorera en hel del

let ingArr = [];
let ingredientNames = [];
let ingredients = [];
let secondaryIngredientNames = [];
let secondaryIngredients = [];
let instArr = [];
let secondaryIngArr = [];
let imageFile;

// Lägg till hela receptet
$(document).on('click keypress', '.btn-add-recipe', async function(e) {
    if(e.keyCode == 32 || e.which == 1){
      e.preventDefault;
    }
    else {
      return;
    }
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

    let uploadedImage = await firebase.storage().ref().child('images/' + imageFile.name).put(imageFile)

    newRecipeObj.tags = searchTags;

    // att göra - lägga in bild
    newRecipeObj.image = await uploadedImage.ref.getDownloadURL();

    console.log(newRecipeObj, uploadedImage, imageFile)

    newRecipeObj.difficulty = $('#difficulty').val();
    
    let portionSize = $('#portion-size').val()
    newRecipeObj.portions = portionSize;
  
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

    newRecipeObj.ingredientNames = ingredientNames;
    newRecipeObj.ingredients = ingredients;

    newRecipeObj.secondaryIngredientNames = secondaryIngredientNames;
    newRecipeObj.secondaryIngredients = secondaryIngredients;

    if(secondaryIngredientNames.length > 0){
      let selectedPortionSize = $('#secondary-portion-size option:selected').data('text');
      if(selectedPortionSize == 'default' || selectedPortionSize == newRecipeObj.portions){
        $('.select-error').removeClass('d-none');
        return;
      }
      else{
        newRecipeObj.secondPortionSize = selectedPortionSize;
      }
    }

    console.log(newRecipeObj);
    emptyForm();
  });

// Töm formulär
function emptyForm() {
  $('#portion-size').val(4);
  $('.added-ingredient').empty();
  $('.typeahead-ingredients, .add-volume, .add-weight').val('')
  $('#add-unit').val("unit");
  $('#title, #summary, #instruction, #additional-info').val('');
  $('#cooking-time').val(30);
  $('#difficulty').val('medium');
  $('.added-instructions').empty();
  instArr = [];
  ingArr = [];
  ingredientNames = [];
  ingredients = [];
  secondaryIngredientNames = [];
  secondaryIngredients = [];
  secondaryIngArr = [];
  $('input:checkbox:checked').prop('checked', false);
}

// Visa/dölj ny inmatning för ingrediensmängder
$(document).on('click keypress', '.btn-add-ingredient-info', function (e) {
  if(ingArr.length == 0) {
    $('.reference-error').removeClass('d-none');
    return;
  }
  if(e.keyCode == 32 || e.which == 1){
    e.preventDefault;
  }
  else {
    return;
  }
  $('.added-ingredient-info').toggleClass('d-none');
  $('.btn-add-ingredient-info').toggleClass('fa-plus');
  $('.btn-add-ingredient-info').toggleClass('fa-minus');
  $('.add-reference').toggleClass('d-none');
  $('.hide-reference').toggleClass('d-none');
})
  
// Lägg till ny instruktion
$(document).on('click keypress', '.btn-add-instruction', function (e) {
  if(e.keyCode == 32 || e.which == 1){
    e.preventDefault;
    if ($('.add-instruction').val()) {
      $('.added-instructions').append(`
      <p class="btn-sub-instruction mt-2 ml-3 instruction-item" data-text="${$('.add-instruction').val()}"><i class="fas fa-minus" data-text="${$('.add-instruction').val()}" role="button"></i> ${$('.add-instruction').val()}</p>
    `)
    instArr.push($('.add-instruction').val());
    }
    else {
      $('#instruction').val('');
      $('#instruction').attr('placeholder', 'Fyll i minst 1 tecken');
      $('#instruction').addClass('bg-danger');
      return;
    }
    $('.add-instruction').val('');
    $('.add-instruction').removeClass('bg-danger');
  }
  else {
    return;
  }
  
  
})

// Lägg till ingredienser
$(document).on('click keypress', '.btn-add-ingredient', function (e) {
  if(e.keyCode == 32){
    e.preventDefault;
    formCheck();
  }
  // keycode släpper igenom en tom unitselektion?
  if(!formCheck()){
    return;
  }
  let ingText = (`${$('.typeahead-ingredients').val()} ${$('.add-volume').val()} ${$('#add-unit').val()}/${$('.add-weight').val()}g`)
  $('.added-ingredient').append(`
    <p class="btn-sub-ingredient mt-2 ml-3 ingredient-item" data-text="${ingText}"><i class="fas fa-minus" role="button" data-text="${ingText}"></i> ${ingText}</p>
  `)
  ingArr.push(ingText);

  ingredientNames.push($('.typeahead-ingredients').val());

  let amount = $('.add-volume').val();
  let mass = $('.add-weight').val();
  let name = $('.typeahead-ingredients').val();
  let unit = $('#add-unit').val();
  let newIngredient = {amount:amount, mass:mass, name:name, unit:unit};
  ingredients.push(newIngredient);
  $('.typeahead-ingredients, .add-volume, .add-weight').val('')
  $('#add-unit').val("unit");
  $('.reference-error').addClass('d-none');
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
  if(unitCheck == 'unit'){
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

// lägg till en andra ingrediensreferens
$(document).on('click keypress', '.secondary-btn-add-ingredient', function (e) {
  if(e.keyCode == 32 || e.which == 1){
    e.preventDefault;
    secondaryFormCheck();
  }
  if(!secondaryFormCheck()){
    return;
  }
  let ingText = (`${$('.secondary-typeahead-ingredients').val()} ${$('.secondary-add-volume').val()} ${$('#secondary-add-unit').val()}/${$('.secondary-add-weight').val()}g`)
  $('.secondary-added-ingredient').append(`
    <p class="btn-sec-sub-ingredient mt-2 ingredient-item" data-text="${ingText}"><i class="fas fa-minus" role="button" data-text="${ingText}"></i> ${ingText}</p>
  `)
  secondaryIngArr.push(ingText);

  secondaryIngredientNames.push($('.secondary-typeahead-ingredients').val());

  let amount = $('.secondary-add-volume').val();
  let mass = $('.secondary-add-weight').val();
  let name = $('.secondary-typeahead-ingredients').val();
  let unit = $('#secondary-add-unit').val();
  let secondaryNewIngredient = {amount:amount, mass:mass, name:name, unit:unit};
  secondaryIngredients.push(secondaryNewIngredient);

  $('.secondary-typeahead-ingredients, .secondary-add-volume, .secondary-add-weight').val('')
  $('#secondary-add-unit').val("unit");
})

function secondaryFormCheck(){
  // Kontroll av ingredienslängd
  let ingredientCheck = $('.secondary-typeahead-ingredients').val();
  if(ingredientCheck.length < 2){
    $('.secondary-typeahead-ingredients').val('');
    $('.secondary-typeahead-ingredients').attr('placeholder', 'Fyll i minst 2 bokstäver');
    $('.secondary-typeahead-ingredients').addClass('bg-danger');
    return false;
  }

  // Kontroll av antal
  let volumeCheck = $('.secondary-add-volume').val();
    if(volumeCheck.length < 1){
      $('.secondary-add-volume').val('');
      $('.secondary-add-volume').attr('placeholder', 'Fyll i minst 1 siffra');
      $('.secondary-add-volume').addClass('bg-danger');
      return false;
  } 

  // Kontroll av enhet
  let unitCheck = $('#secondary-add-unit').val();
  if(unitCheck == 'unit'){
    $('#secondary-add-unit').addClass('bg-danger');
    return false;
  }

  // Kontroll av vikt
  let weightCheck = $('.secondary-add-weight').val();
    if(weightCheck.length < 1){
      $('.secondary-add-weight').val('');
      $('.secondary-add-weight').addClass('darkFont');
      $('.secondary-add-weight').attr('placeholder', 'Fyll i minst 1 siffra');
      $('.secondary-add-weight').addClass('bg-danger');
      return false;
  } 
  return true;
}
// slut andra inmatning

// Ta bort felmeddelande från inmatning
$('.typeahead-ingredients, .secondary-typeahead-ingredients, #title, #summary, #instruction').focus(function(){
  $('.typeahead-ingredients, .secondary-typeahead-ingredients, #title, #summary, #instruction').removeClass('bg-danger');
  $('.typeahead-ingredients, .secondary-typeahead-ingredients').attr('placeholder', 'Ingrediens');
  $('#title').attr('placeholder', " T.ex. 'Pad Thai'");
  $('#summary').attr('placeholder', "T.ex. 'En fräsch och kryddig kycklingrätt med smak av lime, vitlök och ostronsås.'");
  $('#instruction').attr('placeholder', "T.ex. 'Skär kamelen i bitar innan du steker den i rikligt med smör'")
});

$('.add-volume, .secondary-add-volume').focus(function(){
  $('.add-volume, .secondary-add-volume').removeClass('bg-danger');
  $('.add-volume, .secondary-add-volume').attr('placeholder', ' Antal');
});

$('.add-weight, .secondary-add-weight').focus(function(){
  $('.add-weight, .secondary-add-weight').removeClass('bg-danger');
  $('.add-weight, .secondary-add-weight').attr('placeholder', ' Vikt i g');
});

$('#add-unit, #secondary-add-unit').focus(function(){
  $('#add-unit, #secondary-add-unit').removeClass('bg-danger');
})

// Ta bort från instruktions-lista
$(document).on('click', '.btn-sub-instruction', function(e){
  let delInstruction = $(e.target).data('text');
  for(let i = 0; i < instArr.length; i++){
    if(instArr[i] == delInstruction){
      instArr.splice(i, 1);
    }
  }
  $(this).remove();
})

// Ta bort från ingrediens-lista
$(document).on('click keypress', '.btn-sub-ingredient', function(e){
  if(e.keyCode == 32 || e.which == 1){
    e.preventDefault;
    let delInstruction = $(e.target).data('text');
    for(let i = 0; i < ingArr.length; i++){
      if(ingArr[i] == delInstruction){
        ingArr.splice(i, 1);
        ingredients.splice(i, 1);
        ingredientNames.splice(i, 1);
      }
    }
    console.log(ingArr);
    console.log(secondaryIngArr);
  }
  else {
    return;
  }
  $(this).remove();
});

// Ta bort från ingrediens-lista
$(document).on('click keypress', '.btn-sec-sub-ingredient', function(e){
  if(e.keyCode == 32 || e.which == 1){
    e.preventDefault;
    let delInstruction = $(e.target).data('text');
    for(let i = 0; i < secondaryIngArr.length; i++){
      if(secondaryIngArr[i] == delInstruction){
        secondaryIngArr.splice(i, 1);
        secondaryIngredients.splice(i, 1);
        secondaryIngredientNames.splice(i, 1);
      }
    }
    console.log(ingArr);
    console.log(secondaryIngArr);
  }
  else {
    return;
  }
  $(this).remove();
})

$('#secondary-portion-size').on('change', function(){
  $('.select-error').addClass('d-none');
})

$(document).ready(function()
{
	$("#fileuploader").uploadFile({
    multiple: false,
  autoSubmit: false,
  maxFileCount: 1,
  onSubmit:function(files)
{
  // console.log(files)
  return false
    //files : List of files to be uploaded
    //return flase;   to stop upload
},
onSelect:function(files)
{
    imageFile = files[0]
    console.log(files[0])
    return true //to allow file submiss ion.
},
  dragDropStr: "<span>Eller dra och släpp din bild här</span>",
  uploadStr: "Välj bild",
  showPreview: true,
  maxFileCountErrorStr: "<span> kan ej laddas upp. Max tillåtna bilder är: </span>",
  onLoad: function() {
    setTimeout(() => {
      $("[id^=ajax-upload-id]").prop('tabindex', '1')
    }, 1000);
  }
	});
});

$('#add-unit').on('change', function(e) {
  if ($(this).val() === 'g' || $(this).val() === 'hg' || $(this).val() === 'kg') $(this).siblings('.add-weight').prop('disabled', true).prop('placeholder', '')
  else $(this).siblings('.add-weight').prop('disabled', false).prop('placeholder', 'Vikt i g')
})