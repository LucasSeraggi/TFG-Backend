import express from 'express';
import databaseConnection from '../config/databaseConnection.config';
import User from '../models/user.model';

const router = express.Router();

router.get('/api', (_: any, res: any) => {
  res.status(200).send({
    success: true,
    message: 'Bem Vindo!',
    version: '1.0.0',
  });
});

router.get('/users', async (_: any, res: any) => {
  const querySelectUsers = {
    text: `
            SELECT * FROM users
        `
  }
  try {
    const users = await databaseConnection.dbConn(querySelectUsers);
    res.status(200).send({
      success: true,
      message: users.rows
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).send({
      success: false,
      message: err.message
    });
  }
})


router.post('/school/register', async (req: any, res: any) => {
  const values = [
    req.body.name,
    req.body.cnpj,
    req.body.logo,
    req.body.cep,
  ];

  const queryInsertSchool = {
    text: `
            INSERT INTO schools (
                name, cnpj, logo, cep 
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                name
        `,
    values,
  };

  try {
    const schoolCreate = await databaseConnection.dbConn(queryInsertSchool);
    // console.log(schoolCreate);
    res.status(200).send({
      success: true,
      message: `School ${schoolCreate.rows[0].name} created success. ID:${schoolCreate.rows[0].id}`,
      id: schoolCreate.rows[0].id,
    });
  } catch (err: any) {
    console.error(err);
    res.status(400).send({
      success: false,
      message: err.message
    });
  }
});

router.get('/test', async (_: any, res: any) => {
  let a = await User.findEmail('Jackson')
  console.log(a);
  res.status(201).send({});
});

export = router;
