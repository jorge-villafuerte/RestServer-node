const express = require('express');
const app = express();

app.use(require('./routes'));
app.use(require('./login'));
app.use(require('./categoriaRoutes'));
app.use(require('./productoRoutes'));
app.use(require('./upload'));
app.use(require('./imagenesRoutes'));
module.exports = app;