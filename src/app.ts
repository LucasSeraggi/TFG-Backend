import express from 'express';
import cors from "cors";

// Rotas
import Index from './routes/index';
import UserRoutes from './routes/user.routes';
import SchoolRoutes from './routes/school.routes';
import ClassRoutes from './routes/class.routes';
import RoleRoutes from './routes/role.routes';
import SubjectRoutes from './routes/subject.routes';

const app = express();
// const databaseConnection = require('./config/databaseConnection.config');

app.use(cors());
app.use(express.json())
//app.use() bibliotecas que for usar (provavelmente as de login)

// Banco de Dados
//app.set(databaseConnection.dbConn());

app.use(Index);  // Remover
app.use(UserRoutes);
app.use(SchoolRoutes);
app.use(ClassRoutes);
app.use(RoleRoutes);
app.use(SubjectRoutes);

// catch 404 and forward to error handler
app.use(function (_, res, __) {
  console.log('Router not found');
  res.status(404).send({
    status: 404,
    message: 'Router not found',
  });
});

export = app
