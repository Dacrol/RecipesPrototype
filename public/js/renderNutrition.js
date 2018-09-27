async function renderNutrition(dish) {
  let nutritionData = await $.getJSON('/json/naringsinnehall.json')
  console.log(dish)
  console.log(nutritionData)

  let nutritionArray = dish.ingredients.map(ingredient => {
    let data =
      nutritionData.find(
        data =>
          data.Livsmedelsnamn.toLowerCase() === ingredient.name.toLowerCase()
      ) ||
      nutritionData.find(data =>
        data.Livsmedelsnamn.toLowerCase().includes(
          ingredient.name.toLowerCase()
        )
      ) ||
      null
      return data
  }).filter(data => !!data)
  console.log(nutritionArray)
  
}
