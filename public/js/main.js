$.getJSON("/json/recipies.json", function (data) { 
    data.forEach(recipe => $('#recipe-list')
    .append(`<div class="col-4 mb-5">
    <div class="card h-100 mb-4 shadow-sm">
      <img class="card-img-top" alt="" style="height: 225px; width: 100%; display: block;" src="${recipe.image}">
      <div class="card-body d-flex flex-column justify-content-between">
        <p class="card-text">${recipe.summary}</p>
        <div class="d-flex justify-content-between align-items-center">
          <i class="far fa-clock fa-1point5"></i>
          <small class="text-muted">${recipe.time} mins</small>
        </div>
      </div>
    </div>
  </div>`))
  }
);
