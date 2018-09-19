
// Ladda upp all näringsinfo
db = firebase.firestore(); nutritionData.forEach(item => db.collection('Näringsinnehåll').doc(item.Livsmedelsnamn.replace(/\//g, '')).set(item))

// Hämta all näringsinfo
(await firebase.firestore().collection('Näringsinnehåll').get()).docs

// Ladda upp alla recept
$.getJSON('/json/recipes.json').then(recipes => recipes.forEach(recipe => db.collection('Recipes').doc(recipe.dish.replace(/\//g, '')).set(recipe)))
