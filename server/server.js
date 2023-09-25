import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport-local';

import userModel from "./model/User.js";

const app = express();
dotenv.config();
app.use(express.json());






async function startup() {
  await mongoose.connect(process.env.DB_URL);
  app.listen(3000, () => console.log('Started on http://localhost:3000'));
}
startup();


