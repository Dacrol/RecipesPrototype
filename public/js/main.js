const db = firebase.firestore()

db.collection('Recipes').get().then(querySnapshot => {
  Promise.all(querySnapshot.docs.map(doc => doc.data())).then(recipes => {
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
  })
})

// for new.html

// Lägg till hela receptet
$(document).on('click', '.btn-add-recipe', function() {
  $('.add-success').toggleClass('d-none')
})

// Lägg till ny instruktion
$(document).on('click', '.btn-add-instruction', function() {
  if ($('.add-instruction').val()) {
    $('.added-instructions').append(`
    <li class="mt-1">${$('.add-instruction').val()}</li>
  `)
  }
  $('.add-instruction').val('')
})

$(document).on('click', '.btn-add-ingredient', function() {
  if ($('.add-ingredient').val() && $('.add-volume').val()) {
    $('.added-ingredient').append(`
    <li class="mt-1">${$('.add-ingredient').val()} ${$(
      '.add-volume'
    ).val()}</li>
  `)
    $('.add-ingredient, .add-volume').val('')
  }
})

$.getJSON('/json/naringsinnehall.json', function(data) {
  let livsmedel = data.map(item => {
    return item['Livsmedelsnamn']
  })
  $.typeahead({
    input: '.typeahead-ingredients',
    order: 'desc',
    source: livsmedel,
    hint: true
  })
})

function formatUrl(url) {
  return url
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s\W-]+/g, '')
    .replace(/((%C3%B6)|(%C3%A4)|(%C3%A5))/g, '')
    .replace(/&/g, '-')
    .trim()
}
