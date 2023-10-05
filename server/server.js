import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
import log4js from 'log4js';

import userModel from './model/User.js';
import presentationModel from './model/Presentation.js';

import auth from './middleware.auth.js';

const app = express();
dotenv.config();
app.use(express.json({ limit: '50mb' }));

log4js.configure({
  appenders: {
    STARTUP: { type: "file", filename: "log.log" },
    REGISTER: { type: "file", filename: "log.log" },
    LOGIN: { type: "file", filename: "log.log" },
    SAVE_PRESENTATION: { type: "file", filename: "log.log" },
    LOAD_PRESENTATION: { type: "file", filename: "log.log" },
    LOAD_USER: { type: "file", filename: "log.log" },
    CONVERT_IMAGE: { type: "file", filename: "log.log" }
  },
  categories: {
    default: { appenders: ["REGISTER", "LOGIN", "SAVE_PRESENTATION", "LOAD_PRESENTATION", "LOAD_USER", "CONVERT_IMAGE", "STARTUP"], level: "info" }
  },
});

const StartupLogger = log4js.getLogger('STARTUP');
const LoginLogger = log4js.getLogger('LOGIN');
const RegisterLogger = log4js.getLogger('REGISTER');
const SavePresentationLogger = log4js.getLogger('SAVE_PRESENTATION');
const LoadPresentationLogger = log4js.getLogger('LOAD_PRESENTATION');
const LoadUserLogger = log4js.getLogger('LOAD_USER');
const ConvertImageLogger = log4js.getLogger('CONVERT_IMAGE');


app.post('/login', async (req, res) => {
  try {
    if (!(req.body.email && req.body.password)) {
      return res.status(400).json({ res: 'All fields are required' });
    }

    const user = await userModel.findOne({ email: req.body.email.toLowerCase() });

    if (user && await bcrypt.compare(req.body.password, user.password)) {

      const token = jwt.sign({ user_id: user._id, email: user.email }, process.env.TOKEN_KEY, { expiresIn: "7d" });

      LoginLogger.info(`${user._id} logged in`);
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

    RegisterLogger.info(`${user._id} registered`);
    return res.status(200).json({ id: user._id, token });
  } catch (err) {
    console.log(err);
  }
});

app.get('/api/user/:userid', auth, async (req, res) => {
  const user = await userModel.findById(req.params.userid).populate({ path: 'presentations', options: { sort: { 'modifiedAt': -1 } } });

  LoadUserLogger.info(`${req.params.userid}'s data was loaded`);
  res.status(200).json({ name: user.name, presentations: user.presentations });
});

app.get('/api/user/:userid/presentation/:presentationid', auth, async (req, res) => {
  const presentation = await presentationModel.findById(req.params.presentationid);
  LoadPresentationLogger.info(`${req.params.userid} loaded presentation ${req.params.presentationid}`);
  res.status(200).json(presentation);
});

app.put('/api/user/:userid/presentation/:presentationid', auth, async (req, res) => {
  const presentation = await presentationModel.findByIdAndUpdate(req.params.presentationid, { title: req.body.title, data: req.body.data, modifiedAt: Date.now() });
  SavePresentationLogger.info(`${req.params.userid} saved presentation ${req.params.presentationid}`);
  res.status(200).json(presentation);
});

// Converting image to Base64 webp, and resizing
app.post('/api/user/:userid/presentation/:presentationid/image', auth, async (req, res) => {
  const imgData = req.body.data.split(';base64,').pop();
  const imgBuffer = Buffer.from(imgData, 'base64');
  const imgConverted = await sharp(imgBuffer, { animated: true }).resize({ height: 500, withoutEnlargement: true }).webp().toBuffer();
  const img = imgConverted.toString('base64');
  ConvertImageLogger.info(`${req.params.userid} converted an image in presentation ${req.params.presentationid}`);
  res.status(200).json({src: img});
});


async function startup() {
  await mongoose.connect(process.env.DB_URL);
  app.listen(3000, () => console.log('Started on http://localhost:3000'));
  StartupLogger.info(`Server started`);
}
startup();
