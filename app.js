require('dotenv').config();

const express =require('express');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override')
const connectDB = require('./server/config/db')
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')

const app = express();
const port = 5000 || process.env.PORT;

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      autoRemove:'native'
    }),
    cookie: { maxAge :3600000}
  
  }));

app.use(passport.initialize());
app.use(passport.session());


app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(methodOverride('_method'))

connectDB();

//static files
app.use(express.static('public'));

//Templating Engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/dashboard')) {
      app.set('layout', './layouts/dashboard');
    } else {
      app.set('layout', './layouts/main');
    }
    next();
  });

  //Routes
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));

//Handle 404
app.get('*',function(req,res) {
    res.status(404).render('404')
})

app.listen(port, () =>{
    console.log(`App listening on port ${port}`)
})










