import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const bakerSchema = new Schema({
  name: String,
  username: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  address: String,
  coordinates: {
    lat: Number,
    long: Number,
  },
  authProvider: { type: String, enum: ["local", "google", "facebook"] },
  authId: String,
});

bakerSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  }
  next();
});

bakerSchema.methods.validPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);

  return result;
};

const Baker = mongoose.model("Baker", bakerSchema);

export default Baker;
