renderShoppinglist();

function renderShoppinglist() {
  html = '';
  try {
    JSON.parse(localStorage.getItem('shoppinglist')).forEach(ingredient => html += `<li>${ingredient.amount} ${ingredient.unit} ${ingredient.name}</li>\n`);
  console.log(html)
  $('#shopping-list').append(html);
  } catch (error) {
    console.log('Shoppinglistan är tom');
  }
  
}