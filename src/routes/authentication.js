const express = require('express');
const { route } = require('.');
var router = express.Router();
const passport = require('passport');
var LStrategy = require('passport-local');
var crypto = require('crypto');
var db = require('../database');
const LoginController = require('../lib/passport');



router.get('/signin', LoginController.login);
router.get('/signup', LoginController.register);
router.post('/signup', LoginController.storeUser);
router.post('/signin', LoginController.auth);
router.get('/profile', LoginController.profile)
router.get('/logout', LoginController.logout);

router.get('/auth/inicio', (req, res) => {
    res.render('auth/inicio');
})

router.get('/Admin/dashboard', async (req, res) => {
    if(req.session.loggedin == true) {
        res.render('Admin/dashboard')       
    }else{
        res.redirect('/signin')
    }
}); 

router.get('/Jugador/dashboardJ', async (req, res) => {
    if(req.session.loggedin == true) {
        res.render('Jugador/dashboardJ')
    }   else{
        res.redirect('/signin')
    } 
}); 
router.get('/Entrenador/dashboardE', async (req, res) => {
    if(req.session.loggedin == true) {
    
        res.render('Entrenador/dashboardE')
    }else{
    res.redirect('/signin')
    }
}); 
/*
router.get('/profile/:UsuNombre', async(req, res) => {
    const data = req.body;
    const { UsuNombre } = req.params;
    UsuNombre = (data.UsuNombre)
    //UsuNombre = req.session.UsuNombre 
    await pool.query('select * from usuario where UsuNombre = ?', [UsuNombre]);
    res.render('auth/profile.hbs', { UsuNombre:UsuNombre [0] });
    console.log(UsuNombre)
});

router.get('Admin/dashboard', LoginController.LoginPlayer);
router.get('Jugadores/dashboardJ', LoginController.LoginPlayer);
router.get('Entrenador/dashboardE', LoginController.LoginPlayer);*/

module.exports = router; 