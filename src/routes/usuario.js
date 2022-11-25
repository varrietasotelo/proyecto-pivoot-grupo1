const express = require('express');
const router = express.Router();

const pool = require('../database'); 

//----------------------------------------RUTAS DE ACTIVIDAD ----------------------------------------------------------

router.get('/add', (req, res) => {
    res.render('usuario/add');
});

router.get('/addEntre', (req, res) => {
    res.render('usuario/addEntre');
});

router.post("/adds", async (req, res) => {
    const {ActDenominacion, ActDescripcion} = req.body;
    const newT = {
        ActDenominacion,
        ActDescripcion
    };
    //se elimino un await 
    await pool.query('insert into actividad set ?', [newT]);
    req.flash('success', 'Actividad guardada correctamente');
    res.redirect('/usuario');
});

router.get('/', async (req, res) => {
    const actividad = await pool.query('select * from actividad');
    console.log(actividad);
    res.render('usuario/list.hbs', { actividad });
});

router.get('/listadoActivi', async (req, res) => {
    const actividad = await pool.query('select * from actividad');
    console.log(actividad);
    res.render('usuario/listadoActivi.hbs', { actividad });
});

router.get('/listVER', async (req, res) => {
    const actividad = await pool.query('select * from actividad');
    console.log(actividad);
    res.render('usuario/listVER.hbs', { actividad });
});

router.get('/delete/:IdActividad', async(req, res) =>{
    console.log(req.params.IdActividad);
    const { IdActividad } = req.params;
    await pool.query('delete from actividad where IdActividad = ?', [IdActividad]);
    req.flash('success', 'Actividad eliminada');
    res.redirect('/usuario');
});

router.get('/edit/:IdActividad', async(req, res) => {
    const actividad = await pool.query('select * from actividad');
    const { IdActividad } = req.params;
    await pool.query('select * from actividad where IdActividad = ?', [IdActividad]);
    res.render('usuario/edit.hbs', { actividad:actividad [0] });
});

router.post('/edit/:IdActividad', async(req, res) => {
    const { IdActividad } = req.params;
    const { ActDenominacion, ActDescripcion } = req.body;
    const newT = {
        ActDenominacion,
        ActDescripcion
    }; 
    await pool.query('update actividad set ? where IdActividad = ?', [newT, IdActividad]);
    req.flash('success', 'Actividad actualizada correctamente');
    res.redirect('/usuario');
});

//-----------------------------------------RUTAS DE USUARIOS ---------------------------------------------------------

router.get('/listUser', async (req, res) => {
    const usuario = await pool.query('select * from usuario');
    res.render('usuario/listUser', { usuario });
});

/*
router.get('/estado/:IdUsuario', async(req, res) => {
    const usuario = await pool.query('select * from usuario');
    const { IdUsuario } = req.params;
    await pool.query('select * from usuario where IdUsuario = ?', [IdUsuario]);
    res.render('usuario/estado', { usuario:usuario[0] });
});

router.post('/estado/:IdUsuario', async(req, res) => {
    const { IdUsuario } = req.params;
    const { UsuEstado } = req.body;
    await pool.query('update usuario set UsuEstado = ? where IdUsuario = ?', [UsuEstado, IdUsuario]);
    req.flash('success', 'Estado de usuario actualizado correctamente');
    res.redirect('usuario/listUser');
});*/

router.get('/deleteUser/:IdUsuario', async (req, res) =>{
    console.log(req.params.IdUsuario);
    const { IdUsuario } = req.params;
    await pool.query('delete from usuario where IdUsuario = ?', [IdUsuario]);
    req.flash('success', 'Actividad eliminada');
    res.render('usuario/listUser');
});

module.exports = router; 