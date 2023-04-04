import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  username: { type: String, unique: true, required: true },
  displayName: String,
  email: { type: String, unique: true, required: true },
  photoURL: String,
  location: {
    type: {
      type: String,
      default: 'Point',
    },
    coordinates: [Number],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['admin', 'moderator', 'user'], default: 'admin' },
});

const postSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  description: String,
  type: { type: String, enum: ['offer', 'request'], required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const messageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = model('User', userSchema);
const Post = model('Post', postSchema);
const Message = model('Message', messageSchema);

export default { User, Post, Message };
