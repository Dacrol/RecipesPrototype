const db = firebase.firestore()

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
  try {
    // @ts-ignore
    $.typeahead({
      input: '.typeahead-ingredients',
      order: 'desc',
      source: livsmedel,
      hint: true
    })
  } catch (e) {}
})

function formatUrl(url) {
  return url
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s\W-]+/g, '')
    .replace(/((%C3%B6)|(%C3%A4)|(%C3%A5))/g, '')
    .replace(/&/g, '-')
    .replace(/\//g, '')
    .trim()
}
