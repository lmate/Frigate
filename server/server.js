import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import userModel from './model/User.js';
import presentationModel from './model/Presentation.js';

import auth from './middleware.auth.js';

const app = express();
dotenv.config();
app.use(express.json());

app.post('/login', async (req, res) => {
  try {
    if (!(req.body.email && req.body.password)) {
      return res.status(400).json({ res: 'All fields are required' });
    }

    const user = await userModel.findOne({ email: req.body.email.toLowerCase() });

    if (user && await bcrypt.compare(req.body.password, user.password)) {

      const token = jwt.sign({ user_id: user._id, email: user.email }, process.env.TOKEN_KEY, { expiresIn: "7d" });

      return res.status(200).json({ id: user._id, token });

    } else {
      return res.status(200).json({ res: 'Invalid login' });
    }

  } catch (err) {
    console.log(err);
  }
});

app.post('/register', async (req, res) => {
  try {
    if (!(req.body.email && req.body.name && req.body.password)) {
      return res.status(400).json({ res: 'All fields are required' });
    }

    const oldUser = await userModel.findOne({ email: req.body.email.toLowerCase() });
    if (oldUser) {
      return res.status(400).json({ res: 'User already exists' });
    }

    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await userModel.create({
      email: req.body.email.toLowerCase(),
      name: req.body.name,
      password: encryptedPassword
    });

    const token = jwt.sign({ user_id: user._id, email: user.email }, process.env.TOKEN_KEY, { expiresIn: "7d" });

    return res.status(200).json({ id: user._id, token });
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/user/:userid', auth, async (req, res) => {
  const user = await userModel.findById(req.params.userid).populate({path: 'presentations', options: { sort: { 'modifiedAt': -1 } } });
  res.status(200).json({name: user.name, presentations: user.presentations});
});

app.get('/api/user/:userid/presentation/:presentationid', auth, async (req, res) => {
  const presentation = await presentationModel.findById(req.params.presentationid);
  res.status(200).json(presentation);
});

app.put('/api/user/:userid/presentation/:presentationid', auth, async (req, res) => {
  const presentation = await presentationModel.findByIdAndUpdate(req.params.presentationid, {title: req.body.title, data: req.body.data, modifiedAt: Date.now()});
  res.status(200).json(presentation);
});


async function startup() {
  await mongoose.connect(process.env.DB_URL);
  app.listen(3000, () => console.log('Started on http://localhost:3000'));
}
startup();
