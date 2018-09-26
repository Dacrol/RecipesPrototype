const db = firebase.firestore()

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

$('#form-search').submit(function(e){
  e.preventDefault()
  window.location.pathname = '/search/' + $('#form-search input').val()
  return false
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
