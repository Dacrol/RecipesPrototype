async function renderNutrition(dish) {
  let nutritionData = await $.getJSON('/json/naringsinnehall.json')
  // console.log(dish)
  // console.log(nutritionData)

  let nutritionArray = dish.ingredients
    .map(ingredient => {
      let data =
        nutritionData.find(
          data =>
            data.Livsmedelsnamn.toLowerCase() === ingredient.name.toLowerCase()
        ) ||
        nutritionData.find(data =>
          data.Livsmedelsnamn.toLowerCase().includes(
            ingredient.name.toLowerCase()
          )
        )
      return { data: data, mass: ingredient.mass }
    })
    .filter(entry => !!entry.data)
  // console.log(nutritionArray)
  let nutritionSum = nutritionArray
    .map(entry => entry.data)
    .reduce((acc, current, index) => {
      for (const property in current) {
        if (current.hasOwnProperty(property)) {
          if (!isNaN(acc[property])) {
            if (index === 0) {
              acc[property] = acc[property] * (nutritionArray[index].mass / 100)
            }
            acc[property] =
              '' +
              (+acc[property] +
                +current[property] * (nutritionArray[index].mass / 100))
          } else delete acc[property]
        }
      }
      return acc
    })
  delete nutritionSum.Livsmedelsnummer
  Object.keys(nutritionSum).map(key => {
    nutritionSum[key] = Math.round(nutritionSum[key] / dish.portions)
  })
  // console.log(nutritionSum)
}
