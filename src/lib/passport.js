const passport = require('passport');
var db = require('../database');
var LStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { hash } = require('bcryptjs');
const pool = require('../database');
var forEach = require("for-each");
const express = require('express');
const router = express.Router();
const LoginController = require('../lib/passport');

/*
function LoginPlayer (req, res) {
  if(req.session.loggedin == true) {
    const data = req.body;
   
        if(data.IdRol == 1) {
          res.redirect('Admin/dashboard')
        }else if (data.IdRol == 2) {
          res.redirect('Entrenador/dashboardE')
        }else{
          res.redirect('Jugadores/dashboardJ')
        }
      
    
  }else{
    res.redirect('/')
  }
};*/ 



//si el usuario ha iniciado sesion no puede iniciar sesion de nuevo 
function login(req, res) {
  if(req.session.loggedin != true) {
    res.render('auth/signin');
  }else{
  res.redirect('/');
  }
};

//si el usuario ha iniciado sesion no puede registrarse 
function register(req, res) {
  if(req.session.loggedin != true) {
    res.render('auth/signup');
  }else{
  res.redirect('/');
  }
};

function auth(req, res) {

  const data = req.body;
  UsuNombre = (data.UsuNombre);
  
  req.getConnection((err, pool) => {
    pool.query('select * from usuario where UsuNombre = ?', [data.UsuNombre], (err, UsuData) => {

      if(UsuData.length > 0) {

       UsuData.forEach(element => {
        bcrypt.compare(data.UsuContraseña, element.UsuContraseña, (err, isMatch) => {
          if(!isMatch) { //si la contraseña no coincide
            res.render('auth/signin', {err2: 'Error: contraseña incorrecta'}); //manda error
          }else{ //si la contraseña coincide 
            req.session.loggedin = true;
            req.session.UsuNombre = element.UsuNombre;
            req.session.name = element.name;
            console.log(UsuNombre);
            //console.log(data.IdRol) 
            //console.log(req.body)
            req.getConnection((err, pool) => {
              pool.query('select IdRol from usuario where UsuNombre = ?', [data.UsuNombre], (err, IdRol) => {
                var dataID=JSON.parse(JSON.stringify(IdRol)) //convierte el RowDataPacket en JSON
                console.log(dataID[0].IdRol); //saca el dato especifico del JSON
                console.log(dataID[0].IdRol === 1) //permite visualizar que la comparacion se este realizando correctamente
                if(dataID[0].IdRol === 1) {
                  res.redirect('Admin/dashboard')
                }else if (dataID[0].IdRol === 2) {
                  res.redirect('Entrenador/dashboardE')
                }else{
                  res.redirect('Jugador/dashboardJ')
                }
              })
            })
              
            //res.redirect('/profile')
          }
        })
       });

      }else{
         
        res.render('auth/signin', {err2: 'Error:  el usuario no existe'});

      }
    })
  })
};

function storeUser(req, res) {
  const data = req.body;

  req.getConnection((err, pool) => {
    pool.query('select * from usuario where UsuNombre = ?', [data.UsuNombre], (err, UsuData) => {
      if(UsuData.length > 0) {
        res.render('auth/signup', {err1: 'Error:  el usuario ya existe'});
      } else {
          bcrypt.hash(data.UsuContraseña, 12).then(hash => {
            data.UsuContraseña = hash; 
            
            req.getConnection( async (err, pool) => {
              await pool.query('insert into usuario set ?', [data], (err, rows) => {
                
                res.redirect('/signin');

            });
          });
          
        });
      }
    })
  })
};

function profile(req, res) {
  if(req.session.loggedin == true) {
    res.render('auth/profile');
  }else{
  res.redirect('/');
  }
};

function logout(req, res) {
  if(req.session.loggedin == true) {
    req.session.destroy();
  }else {
    res.redirect('/signin');
  }
}


module.exports = {
  login,
  register, 
  storeUser, 
  auth, 
  profile,
  logout,
 // LoginPlayer
}