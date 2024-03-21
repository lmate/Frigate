import { Schema, model } from "mongoose";

const presentationSchema = new Schema({
  title: String,
  data: String,
  createdAt: {type: Date, default: Date.now},
  modifiedAt: {type: Date, default: Date.now},
});

export default model('Presentation', presentationSchema);