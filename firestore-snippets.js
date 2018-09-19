/* Läs för mer info: https://firebase.google.com/docs/firestore/ */

/* 
  Notera att .replace(/\//g, '')) endast är till för att ta bort alla "/" från namnet, då "/" indikerar ett underdokument i Firestore, och behövs inte om namnet inte innehåller "/".
*/

// const db = firebase.firestore()

// Ladda upp all näringsinfo
$.getJSON('/json/naringsinnehall.json').then(nutritionData => {
  nutritionData.forEach(item =>
    db
      .collection('Näringsinnehåll')
      .doc(item.Livsmedelsnamn.replace(/\//g, ''))
      .set(item)
  )
})

// Ladda upp alla recept
$.getJSON('/json/recipes.json').then(recipes =>
  recipes.forEach(recipe =>
    db
      .collection('Recipes')
      .doc(recipe.dish.replace(/\//g, ''))
      .set(recipe)
  )
)

// Ladda upp ett recept
db.collection('Recipes')
  .doc(recipe.dish.replace(/\//g, ''))
  .set(recipe)

// Hämta ett recept
db.collection('Recipes')
  .doc('Grönsakslasagne')
  .get()
  .then(recipe => {
    console.log(recipe.data())
  })

// Hämta recept med över 4 i rating
db.collection('Recipes')
  .where('rating', '>=', 4)
  .get()
  .then(recipes => {
    recipes.forEach(recipe => console.log(recipe.data()))
  })
