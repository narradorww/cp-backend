import mongoose from 'mongoose';

const { Schema } = mongoose;

const bakerSchema = new Schema({
  name: String,
  username: String,
  address: String,
  coordinates: {
    lat: Number,
    long: Number,
  },
  authProvider: { type: String, enum: ['google', 'facebook'] },
  authId: String,
});

const Baker = mongoose.model('Baker', bakerSchema);

export default Baker;
