let ingredientlist = [];
renderShoppinglist();

function renderShoppinglist() {
  html = '';
  try {
    JSON.parse(localStorage.getItem('shoppinglist')).forEach(ingredient => {
      html += `<tr class="d-flex align-items-center"><td class=""><i class="far fa-square check"></i></td><td>${ingredient.amount}${ingredient.unit} ${ingredient.name}</td></tr>\n`
      ingredientlist.push(ingredient)
    });

    console.log(html)
    $('#ingredient-list').append(html);


    console.log(ingredientlist);
  } catch (error) {
    console.log('Shoppinglistan är tom');
    console.error(error)
  }

}


function printData() {
  $('#printer').hide();
  window.print();
  setTimeout(() => {
    $('#printer').show();
  }, 200);
}

$('#printer').on('click', function () {
  printData();
})