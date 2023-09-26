import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: String,
  name: String,
  password: String,
  presentations: [{
    type: Schema.Types.ObjectId,
    ref: 'Presentation',
  }],
});

export default model('User', userSchema);