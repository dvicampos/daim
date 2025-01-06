const mysql = require('mysql2');

const db = mysql.createConnection({
    host: '108.171.206.154',
    user: 'aseashvt_david',
    password: 'v_)hj(inH9b{',
    database: 'aseashvt_dbdaim',
    port: 3306,
    connectTimeout: 20000
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos.');
});

module.exports = db;
