const mysql = require('mysql'); 
const {promisify} = require('util');

const {database} = require('./keys');

//importa la coneccion
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexion se ha perdido');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La base de datos tiene demasiadas conexiones')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('La conexion fue rechazada')
        }
    }

    if (connection) connection.release();
    console.log('Base de datos conectada')
    return;
}); 

// se convierte en promesas, para asi poder realizar las consultas
pool.query = promisify(pool.query);

module.exports = pool; 