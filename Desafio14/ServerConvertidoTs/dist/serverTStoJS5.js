"use strict";
var express = require('express');
var productos = require('./api/productos');
productos.guardar('perro', 211, 'perro.jpg');
productos.guardar('gato', 311, 'gato.jpg');
productos.guardar('tortuga', 450, 'tortuga.jpg');
productos.listar();
// creo una app de tipo express
var app = express();
var router = express.Router();
app.use('/static', express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// pongo a escuchar el servidor en el puerto indicado
var puerto = 8080;
router.get('/productos/listar', function (req, res) {
    if (productos.array.length < 1) {
        res.json({ error: 'no hay productos cargados' });
    }
    else {
        console.log(productos);
        res.json({ productos: productos.array });
    }
});
router.get('/productos/listar/:id', function (req, res) {
    var info = productos.array;
    var infoID = info[req.params.id - 1];
    if (infoID === undefined) {
        res.json({ error: 'producto no encontrado' });
    }
    else {
        console.log(infoID);
        res.json({ producto: infoID });
    }
});
router.post('/productos/guardar', function (req, res) {
    // post valido
    var info = productos.array;
    var dataForm = req.body;
    dataForm.id = productos.array.length + 1;
    // agregando un Artículo con un id ya existente
    var Existe = info.some(function (producto) { return producto.id === dataForm.id; });
    if (Existe) {
        var productosID = info.map(function (prod) {
            if (prod.id === dataForm.id) {
                dataForm.id++;
                return prod;
            }
            else {
                return prod;
            }
        });
        info.push(dataForm);
    }
    else {
        // Agregando un artículo nuevo
        info.push(dataForm);
    }
    res.redirect('/api/productos/listar');
});
app.use('/api', router);
var server = app.listen(puerto, function () {
    console.log("servidor escuchando en http://localhost:" + puerto);
});
// en caso de error, avisar
server.on('error', function (error) {
    console.log('error en el servidor:', error);
});
