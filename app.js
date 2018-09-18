const express = require('express')
const exphbs = require('express-handlebars')
const helpers = require('./helpers/navbar')

const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.html',
  helpers: helpers
})

app.engine('.html', hbs.engine)
app.set('view engine', '.html')

app.get('/', function(req, res) {
  res.render('home', { layout: 'main-sidebar' })
})

app.get('/recipe', function(req, res) {
  res.render('recipe')
})

app.get('/recipe/:id', function(req, res) {
  res.render('recipe')
})

app.get('/new', function(req, res) {
  res.render('new')
})

app.get('/shoppinglist', function(req, res) {
  res.render('shoppinglist', { layout: false })
})

app.use(express.static('public'))
app.listen(3000, () => {
  console.log('Server open on port 3000')
})
