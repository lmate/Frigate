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
    INFO: { type: 'file', filename: 'server.log' },
    INFO_CONSOLE: { type: 'console' },
    ERROR: { type: 'file', filename: 'server.log' },
    ERROR_CONSOLE: { type: 'console' },
  },
  categories: {
    STARTUP: { appenders: ['INFO', 'INFO_CONSOLE'], level: 'info' },
    REGISTER: { appenders: ['INFO', 'INFO_CONSOLE'], level: 'info' },
    LOGIN: { appenders: ['INFO', 'INFO_CONSOLE'], level: 'info' },
    SAVE_PRESENTATION: { appenders: ['INFO', 'INFO_CONSOLE'], level: 'info' },
    LOAD_PRESENTATION: { appenders: ['INFO', 'INFO_CONSOLE'], level: 'info' },
    LOAD_USER: { appenders: ['INFO', 'INFO_CONSOLE'], level: 'info' },
    CONVERT_IMAGE: { appenders: ['INFO', 'INFO_CONSOLE'], level: 'info' },
    ERROR: { appenders: ['ERROR', 'ERROR_CONSOLE'], level: 'error' },
    default: { appenders: ['INFO', 'INFO_CONSOLE'], level: 'info' }
  },
});

const StartupLogger = log4js.getLogger('STARTUP');
const LoginLogger = log4js.getLogger('LOGIN');
const RegisterLogger = log4js.getLogger('REGISTER');
const SavePresentationLogger = log4js.getLogger('SAVE_PRESENTATION');
const LoadPresentationLogger = log4js.getLogger('LOAD_PRESENTATION');
const LoadUserLogger = log4js.getLogger('LOAD_USER');
const ConvertImageLogger = log4js.getLogger('CONVERT_IMAGE');
const ErrorLogger = log4js.getLogger('ERROR');


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
    ErrorLogger.error(`[Login] ${err}`);
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
    ErrorLogger.error(`[Register] ${err}`);
  }
});

app.get('/api/user/:userid', auth, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userid).populate({ path: 'presentations', options: { sort: { 'modifiedAt': -1 } } });

    LoadUserLogger.info(`${req.params.userid} loaded their data`);
    res.status(200).json({ name: user.name, presentations: user.presentations });
  } catch (err) {
    ErrorLogger.error(`[LoadUser] ${err}`);
  }
});

app.get('/api/user/:userid/presentation/:presentationid', auth, async (req, res) => {
  try {
    const presentation = await presentationModel.findById(req.params.presentationid);
    LoadPresentationLogger.info(`${req.params.userid} loaded presentation ${req.params.presentationid}`);
    res.status(200).json(presentation);
  } catch (err) {
    ErrorLogger.error(`[LoadPresentation] ${err}`);
  }
});

app.put('/api/user/:userid/presentation/:presentationid', auth, async (req, res) => {
  try {
    const presentation = await presentationModel.findByIdAndUpdate(req.params.presentationid, { title: req.body.title, data: req.body.data, modifiedAt: Date.now() });
    SavePresentationLogger.info(`${req.params.userid} saved presentation ${req.params.presentationid}`);
    res.status(200).json(presentation);
  } catch (err) {
    ErrorLogger.error(`[SavePresentation] ${err}`);
  }
});

// Converting image to Base64 webp, and resizing
app.post('/api/user/:userid/presentation/:presentationid/image', auth, async (req, res) => {
  try {
    const imgData = req.body.data.split(';base64,').pop();
    const imgBuffer = Buffer.from(imgData, 'base64');
    const imgConverted = await sharp(imgBuffer, { animated: true }).resize({ height: 500, withoutEnlargement: true }).webp().toBuffer();
    const img = imgConverted.toString('base64');
    ConvertImageLogger.info(`${req.params.userid} converted an image in presentation ${req.params.presentationid}`);
    res.status(200).json({ src: img });
  } catch (err) {
    ErrorLogger.error(`[ConvertImage] ${err}`);
  }
});


async function startup() {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(3000);
    StartupLogger.info(`Server started`);
  } catch (err) {
    ErrorLogger.error(`[Startup] ${err}`);
  }
}
startup();
