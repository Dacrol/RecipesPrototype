module.exports = {
  navbarContent: navbarContent
}

function navbarContent(context) {
  const view = context.data.exphbs.view
  return `<li class="nav-item ${view === 'home' ? 'active' : ''}">
  <a class="nav-link" href="/">Alla recept${
    view === 'home'
    ? '<span class="sr-only">(current)</span>'
    : ''
    }</a>
</li>
<li class="nav-item ${view === 'recipe' ? 'active' : ''}">
  <a class="nav-link" href="/recipe">Veckans recept${
    view === 'recipe'
    ? '<span class="sr-only">(current)</span>'
    : ''
    }</a>
</li>
<li class="nav-item add-recipe" style="display: none;">
  <a class="nav-link ${
                        view === 'new' ? 'active' : ''
                      }" href="/new">Lägg till recept${
    view === 'new' ? '<span class="sr-only">(current)</span>' : ''
    }</a>
</li>
<li class="nav-item login">
  <a class="nav-link" href="#">Logga in</a>
</li>
<li class="nav-item logout" style="display: none;">
  <a class="nav-link" href="#">Logga ut</a>
</li>`
}
