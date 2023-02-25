const express = require('express');
const app = express();
const databaseConnection = require('./config/databaseConnection.config');

// Rotas
const index = require('./routes/index');
const userRoutes = require('./routes/user.routes');

app.use(express.json())
//app.use() bibliotecas que for usar (provavelmente as de login)

// Banco de Dados
//app.set(databaseConnection.dbConn());

app.use(index);
app.use('/api/user', userRoutes);

module.exports = app
