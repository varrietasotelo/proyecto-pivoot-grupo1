const express = require('express');
const morgan = require('morgan');
const exphbs = require("express-handlebars") //handlebars es un motor de plantillas 
const path = require('path');
const { join } = require('path');
//const passport = require('passport');
const { request } = require('http');
const { reset } = require('nodemon');
const flash = require('connect-flash');
const session = require('express-session');
//const mysqlStore = require('express-mysql-session');
const {database} = require('./keys');
var authRouter = require('./routes/authentication');
var logger = require('morgan');
const loginRoutes = require('./routes/authentication');
const myconnection = require('express-myconnection');
const mysql = require('mysql');
const bodyParser = require('body-parser');




var mysqlStore = require('connect-sqlite3')(session);

//Incializaciones - de express y la base de datos
const app = express();
require('./lib/passport');

//configuraciones 
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, './views'));
app.engine('.hbs', exphbs.engine({
    //esta configuracion de main permite que todas las paginas hbs compartan codigo, siempre va a referencia lo que se encuentre en main.hbs
    // lo que se encuentre dentro de los tres {{{ body }}} sera lo que hbs considerara que cambia en cada pagina
    defaultlayout: 'main',
    LayoutsDir: path.join(app.get('views'), 'Layouts'), //join: une directorios, le indica que layouts esta dentro de views
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({
    evtended: true
}));
app.use(bodyParser.json());

//middlewares - funciones que se ejecutan cada vez que se envia una peticion
app.use(myconnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: 'Js15042010&',
    database: 'PIVOOT'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
  //cookie: {maxAge: 600000},
  //store: new mysqlStore({ db: 'PIVOOT.db', dir: './database'  })
}));
//app.use(passport.authenticate('session'));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false})); //acepta desde el formulario los datos de los usuarios
app.use(express.json()); //para que permita enviar y recibir json
app.use(flash()); //permite enviar mensajes al usuario
//app.use(passport.initialize());
//app.use(passport.session());
app.use(express.urlencoded( {extended:true} ));
app.use(express.Router());
app.use('/', authRouter);
app.use('/', loginRoutes);

//variables globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.data = req.data; 
    app.locals.loggedin = req.loggedin; 
    next();
});


//rutas - url del servidor
app.use(require('./routes/index.js'));
app.use(require('./routes/authentication.js'));
app.use('/usuario',require('./routes/usuario.js'));
app.use('/jugador',require('./routes/jugador'));
app.use('/admini',require('./routes/admin'));
app.use('/Entrenador',require('./routes/Entrenador'));
//'/usuario' simplifica el uso de links 

//publicos
app.use(express.static(path.join(__dirname, 'public')));

//funcion para empezar el servidor
app.listen(app.get('port'),() => {
    console.log('Servidor en puerto', app.get('port'))
});

