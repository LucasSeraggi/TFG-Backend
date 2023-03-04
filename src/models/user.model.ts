// import bcrypt from 'bcryptjs';
import db from '../config/databaseConnection.config';
import { Request, Response } from "express";

class User {
  static async save(req: Request) {
    // this.body.password = await bcrypt.hash(user.password, 8)
    const values = [
      req.body.school_id,
      req.body.class_id,
      req.body.name,
      req.body.registration,
      req.body.birth_date,
      req.body.position,
      req.body.phone,
      req.body.email,
      req.body.cpf,
      req.body.rg,
      req.body.password,
      req.body.profile_picture,
      req.body.address,
    ];

    const queryInsertUser = {
      text: `
          INSERT INTO users (
            school_id, class_id, name, registration, birth_date, position,
            phone, email, cpf, rg, password, profile_picture, address
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          RETURNING
              id,
              registration,
              class_id,
              name,
              email
      `,
      values,
    };

    try {
      const userCreate = await db.dbConn(queryInsertUser);
      return userCreate;
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  }

  static async list() {
    const querySelectUsers = {
      text: `
              SELECT * FROM users
          `
    }
    try {
      const users = await db.dbConn(querySelectUsers);
      return users;
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  }

  static async generateAuthToken() {
    // const user = this;
    // const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, 'secret');
    // user.tokens = user.tokens.concat({ token });
    // // await user.save();
    // return token;
  }

  static async findEmail(email: string) {
    const values = [email];
    const query = {
      text: `
          SELECT *
          FROM users
          WHERE email = $1
          Limit 1
      `, values,
    }
    const result = await db.dbConn(query);
    if (result.rowCount == 0) {
      return false;
    } else if (result.rowCount > 0) {
      return true;
    }

    throw 'Error query';
  }

  static async find(req: Request) {
    const values = [
      req.query.cpf
    ];
    const querySelectUser = {
      text: `
                SELECT * FROM users u
                where u.cpf = $1 
            `,
      values,
    }
    try {
      const userFind = await db.dbConn(querySelectUser);
      return userFind;
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  }

  static async delete(req: Request) {
    const values = [
      req.query.cpf
    ];
    const queryDeleteUser = {
      text: `
                DELETE FROM users u
                where u.cpf = $1
                RETURNING
                    name
            `,
      values,
    }
    try {
      const userDelete = await db.dbConn(queryDeleteUser);
      return userDelete;
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  }
}

export = User;

/*
CREATE TABLE IF NOT EXISTS users (
    id SERIAL NOT NULL,
    school_id INT NOT NULL,
    class_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    registration VARCHAR(10) NOT NULL,
    birth_date TIMESTAMP WITH TIME ZONE NOT NULL,
    position ENUM_USERS_POSITION NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    rg VARCHAR(13) NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture jsonb,
    address VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    PRIMARY KEY (id)
);


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, maxlength: 50, required: true },
    email: { type: String, maxlength: 30, required: true },
    password: { type: String, required: true },
    tickets: [
        {
            ticket: { type: String }
        }
    ],
    tokens: [
        {
            token: { type: String, required: true }
        }
    ]
}, {
    timestamps: true,
    collection: 'users',
});

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
});

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, 'secret');
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
        throw new Error({ error: 'Login Inválido!' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error({ error: 'Senha Inválida!' });
    }

    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

*/


