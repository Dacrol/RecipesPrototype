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

  Object.entries(nutritionSum).forEach(entry => {
    let [property, value] = entry
    $('#secondary-nutrition-table').append(`<div class="pr-2">${property} <span class="float-right">${value}</span></div>`)
  })

  $('#primary-nutrition-table')
    .append(`<div class="pr-2">Kolhydrater <span class="float-right">${
    nutritionSum['Kolhydrater (g)']
    } g</span></div>
<div class="pr-2">Protein <span class="float-right">${
    nutritionSum['Protein (g)']
    } g</span></div>
<div class="pr-2">Mättat fett<span class="float-right">${
    nutritionSum['Fett (g)']
    } g</span></div>
<div class="pr-2">Enkelomättat fett<span class="float-right">${nutritionSum['Summa enkelomättade fettsyror (g)']} g</span></div>
<div class="pr-2">Fleromättat fett<span class="float-right">${nutritionSum['Summa fleromättade fettsyror (g)']} g</span></div>
<div class="pr-2">Salt <span class="float-right">${
    nutritionSum['Salt (g)']
    } g</span></div>`)

  console.log(nutritionSum)
}
