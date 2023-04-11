import mongoose from 'mongoose';

const { Schema } = mongoose;

const postSchema = new Schema({
  content: String,
  bakerId: { type: Schema.Types.ObjectId, ref: 'Baker' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

export default Post;
