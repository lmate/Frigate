import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sharp from 'sharp';
import log4js from 'log4js';
import path from 'path';
import { fileURLToPath } from 'url';

import userModel from './model/User.js';
import presentationModel from './model/Presentation.js';

import auth from './middleware.auth.js';

const app = express();
dotenv.config();
app.use(express.json({ limit: '50mb' }));
const MAINFOLDER = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

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
    CREATE_PRESENTATION: { appenders: ['INFO', 'INFO_CONSOLE'], level: 'info' },
    DELETE_PRESENTATION: { appenders: ['INFO', 'INFO_CONSOLE'], level: 'info' },
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
const CreatePresentationLogger = log4js.getLogger('CREATE_PRESENTATION');
const DeletePresentationLogger = log4js.getLogger('DELETE_PRESENTATION');
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
    const presentation = await presentationModel.create({
      title: 'New Presentation',
      data: '{"slides":[[]],"presentationOptions":{"backgroundColor":"#ffffff"}}'
    });
    const user = await userModel.create({
      email: req.body.email.toLowerCase(),
      name: req.body.name,
      password: encryptedPassword,
      presentations: [presentation._id]
    });

    const token = jwt.sign({ user_id: user._id, email: user.email }, process.env.TOKEN_KEY, { expiresIn: "7d" });

    RegisterLogger.info(`${user._id} registered`);
    return res.status(200).json({ id: user._id, token });

  } catch (err) {
    ErrorLogger.error(`[Register] ${err}`);
  }
});

// Get user data
app.get('/api/user/:userid', auth, async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userid).populate({ path: 'presentations', options: { sort: { 'modifiedAt': -1 } } });

    LoadUserLogger.info(`${req.params.userid} loaded their data`);
    res.status(200).json({ name: user.name, presentations: user.presentations });
  } catch (err) {
    ErrorLogger.error(`[LoadUser] ${err}`);
  }
});

// Get presentation
app.get('/api/user/:userid/presentation/:presentationid', auth, async (req, res) => {
  try {
    const presentation = await presentationModel.findById(req.params.presentationid);
    LoadPresentationLogger.info(`${req.params.userid} loaded presentation ${req.params.presentationid}`);
    res.status(200).json(presentation);
  } catch (err) {
    ErrorLogger.error(`[LoadPresentation] ${err}`);
  }
});

// Create presentation
app.post('/api/user/:userid/presentation', auth, async (req, res) => {
  try {
    const presentation = await presentationModel.create({
      title: 'New Presentation',
      data: '{"slides":[[]],"presentationOptions":{"backgroundColor":"#ffffff"}}'
    });
    await userModel.findByIdAndUpdate(req.params.userid, { $push: { presentations: presentation._id } });
    CreatePresentationLogger.info(`${req.params.userid} created presentation ${presentation._id}`);
    res.status(200).json(presentation);
  } catch (err) {
    ErrorLogger.error(`[CreatePresentation] ${err}`);
  }
});

// Delete presentation
app.delete('/api/user/:userid/presentation/:presentationid', auth, async (req, res) => {
  try {
    await presentationModel.findByIdAndDelete(req.params.presentationid);
    await userModel.findByIdAndUpdate(req.params.userid, { $pull: { presentations: req.params.presentationid } });
    DeletePresentationLogger.info(`${req.params.userid} deleted presentation ${req.params.presentationid}`);
    res.status(200).json({});
  } catch (err) {
    ErrorLogger.error(`[DeletePresentation] ${err}`);
  }
});

// Save presentation
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

if (process.env.PRODUCTION === 'true') {
  app.use(express.static(path.join(MAINFOLDER, 'Present')));
  app.get('*', (req, res) =>{
    res.sendFile('index.html', {root: path.join(MAINFOLDER, 'Present')});
  });
}


async function startup() {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(process.env.PRODUCTION === 'true' ? 80 : 3000);
    StartupLogger.info(`Server started`);
  } catch (err) {
    ErrorLogger.error(`[Startup] ${err}`);
  }
}
startup();
