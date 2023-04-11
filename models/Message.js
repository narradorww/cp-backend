import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema({
  content: String,
  senderId: { type: Schema.Types.ObjectId, ref: 'Baker' },
  recipientId: { type: Schema.Types.ObjectId, ref: 'Baker' },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
