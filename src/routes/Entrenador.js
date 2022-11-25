const express = require('express');
const router = express.Router();

const pool = require('../database'); 

router.get('/registroE', (req, res) => {
    res.render('Entrenador/registroE', {UsuNombre: req.session.UsuNombre});
});

router.post("/registroE", async (req, res) => {

    const data = req.body;
    UsuNombre = (data.UsuNombre);
    const {EntNombre, EntApellido, EntDocumento, EntDireccion, EntTelefono, EntCorreo, } = req.body;
    const JugaDatos = {
        EntNombre,
        EntApellido,
        EntDocumento,
        EntDireccion,
        EntTelefono,
        EntCorreo
    };
    
    req.getConnection((err, pool) => {
        pool.query('select * from usuario where UsuNombre = ?', [data.UsuNombre], (err, result) => {
            if(result.length > 0) {
                req.getConnection((err, pool) => {
                    pool.query('select IdUsuario from usuario where UsuNombre = ?', [data.UsuNombre], (err, IdU) => {
                        var dataUSU = JSON.parse(JSON.stringify(IdU));
                        var IdUsuario = dataUSU[0].IdUsuario;
                        console.log(IdUsuario);
                        console.log(UsuNombre);
                         
                        pool.query('INSERT INTO entrenador (IdUsuario, EntNombre, EntApellido, EntDocumento, EntDireccion, EntTelefono, EntCorreo) VALUES (?,?,?,?,?,?,?)', [IdUsuario, EntNombre, EntApellido, EntDocumento, EntDireccion, EntTelefono, EntCorreo]);
                            req.flash('success', 'Informacion guardada correctamente');
                                res.render('Entrenador/registroE', {right: 'informacion guardada correctamente'});
                    });
                });
            }else{
                res.render('Entrenador/registroE', {err2: 'Error:  el usuario no existe'});
            }
        })
    })
});

router.get('/listadoE', async (req, res) => {
    const entrenador = await pool.query('select * from entrenador');
    res.render('Entrenador/listadoE', { entrenador });
});

/*
router.get('/editE/:IdUsuario', async(req, res) => {
    const entrenador = await pool.query('select * from entrenador');
    const { IdUsuario } = req.params;
    await pool.query('select * from entrenador where IdUsuario = ?', [IdUsuario]);
    res.render('Entrenador/editE', { entrenador:entrenador [0] });
});

router.post('/editE/:IdUsuario', async(req, res) => {
    const { IdUsuario } = req.params;
    console.log(IdUsuario); 
    const { EntNombre, EntApellido, EntDocumento, EntTelefono, EntCorreo } = req.body;
    const EntDatos = {
        EntNombre,
        EntApellido,
        EntDocumento,
        EntTelefono,
        EntCorreo
    };
    console.log(EntDatos);
    await pool.query('update entrenador set ? where IdUsuario = ?', [EntDatos, IdUsuario]);
    req.flash('success', 'entrenador actualizado correctamente');
    res.redirect('Entrenador/listadoE', {correcto: 'entrenador actualizado correctamente'});
}); */


 
module.exports = router; 
