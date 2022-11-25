//almacena todas las rutas principales de la aplicacion

const express = require('express');
const router = express.Router();
/*
router.get('/', (req, res) => {
    res.send('Hello World')
});*/


//si inicio sesion que mande a la principal 
//si no ha iniciado sesion que mande a iniciar sesion 
router.get('/', (req, res) => {
    if(req.session.loggedin == true) {
        res.render('auth/profile', {UsuNombre: req.session.UsuNombre}); //nos muestra el nombre de usuario de la persona que ingreso
      }else{
      res.redirect('/signin');
      }
})

router.get('/auth/inicio', (req, res) => {
    if(req.session.loggedin == true) {
        res.redirect('/logout'); //nos muestra el nombre de usuario de la persona que ingreso
      }else{
      res.redirect('/auth/inicio');
      }
})




module.exports = router;