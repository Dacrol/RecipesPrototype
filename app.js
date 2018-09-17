const express = require('express')
const exphbs = require('express-handlebars')

const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.engine(
  'html',
  exphbs({
    extname: 'html',
    defaultLayout: 'main'
  })
)
app.set('view engine', 'html')

app.get('/', function(req, res) {
  res.render('home', { layout: 'main-sidebar' })
})

app.get('/recipe/:id', function(req, res) {
  res.render('recipe')
})

app.get('/new', function(req, res) {
  res.render('new')
})

app.use(express.static('public'))
app.listen(3000, () => {
  console.log('Server open on port 3000')
})
