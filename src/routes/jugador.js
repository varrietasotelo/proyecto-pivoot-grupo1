const express = require('express');
const router = express.Router();

var session = require('express-session');

const pool = require('../database'); 

//const jugador = 

//const UsuNombre = (req.session.UsuNombre);

router.get('/registroJ', (req, res) => {
    res.render('jugador/registroJ', {UsuNombre: req.session.UsuNombre});
});
/*
router.get('/registroJ/:IdUsuario', async(req, res) => {
    const jugador = await pool.query('select * from jugador');
    const usuario = await pool.query('select * from usuario');
    const { IdUsuario } = req.params;
    await pool.query('select * from usuario where IdActividad = ?', [IdUsuario]);
    //res.render('usuario/edit.hbs', { jugador:jugador [0] });
    console.log({ usuario:usuario [0] });
    console.log({ jugador:jugador [0] }); 
});*/

router.post("/registroJ", async (req, res) => {

    const data = req.body;
    UsuNombre = (data.UsuNombre);
    const {JugNombre, JugApellido, JugDocumento, JugTelefono, JugCorreo} = req.body;
    const JugaDatos = {
        JugNombre,
        JugApellido,
        JugDocumento,
        JugTelefono,
        JugCorreo
    };
    req.getConnection((err, pool) => {
        pool.query('select * from usuario where UsuNombre = ?', [data.UsuNombre], (err, result) => {
            if(result.length > 0) {
                req.getConnection((err, pool) => {
                    pool.query('select IdUsuario from usuario where UsuNombre = ?', [data.UsuNombre], (err, IdU) => {
                        var dataUSU = JSON.parse(JSON.stringify(IdU));
                        var IdUsuario = dataUSU[0].IdUsuario;
                        console.log(IdUsuario);
                                    
                        pool.query('INSERT INTO jugador (IdUsuario, JugNombre, JugApellido, JugDocumento, JugTelefono, JugCorreo) VALUES (?,?,?,?,?,?)', [IdUsuario, JugNombre, JugApellido, JugDocumento, JugTelefono, JugCorreo]);
                        req.flash('success', 'Informacion guardada correctamente');
                        res.render('jugador/registroJ');
                    });
                });
            }else{
                res.render('jugador/registroJ', {err2: 'Error:  el usuario no existe'});
            }
        })
    })
});

router.get('/listadoJ', async (req, res) => {
    const jugador = await pool.query('select * from jugador');
    console.log(jugador);
    res.render('jugador/listadoJ', { jugador });
});

router.get('/listadoJEntre', async (req, res) => {
    const jugador = await pool.query('select * from jugador');
    console.log(jugador);
    res.render('jugador/listadoJEntre', { jugador });
});


/*
router.get('/editJ/:IdUsuario', async(req, res) => {
    const jugador = await pool.query('select * from jugador');
    const { IdUsuario } = req.params;
    await pool.query('select * from jugador where IdUsuario = ?', [IdUsuario]);
    res.render('jugador/editJ.hbs', { jugador });
});

router.post('/editJ/:IdUsuario', async(req, res) => {
    const { IdUsuario } = req.params;
    const { JugNombre, JugApellido, JugDocumento, JugTelefono, JugCorreo } = req.body;
    const JugaDatos = {
        JugNombre,
        JugApellido,
        JugDocumento,
        JugTelefono,
        JugCorreo
    };
    
    await pool.query('update jugador set ? where IdUsuario = ?', [JugaDatos, IdUsuario]);
    req.flash('success', 'jugador actualizado correctamente');
    res.redirect('jugador/listadoJ'); //verificar esta funcion//NO ESTA FUNCIONANDO LA ACTUALIZACION
}); 
*/


module.exports = router; 