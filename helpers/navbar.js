module.exports = {
  navbarContent: navbarContent
}

function navbarContent(context) {
  const view = context.data.exphbs.view
  // console.log(view)
  return `
  <li class="nav-item ${view === 'home' ? 'active' : ''}">
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
                    <li class="nav-item">
                      <a class="nav-link ${
                        view === 'new' ? 'active' : ''
                      }" href="/new">Lägg till recept${
    view === 'new' ? '<span class="sr-only">(current)</span>' : ''
  }</a>
                    </li>
  `
}
