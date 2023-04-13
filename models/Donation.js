import mongoose from 'mongoose';

const { Schema } = mongoose;

const donationSchema = new Schema({
  donorId: { type: Schema.Types.ObjectId, ref: 'Baker' },
  recipientId: { type: Schema.Types.ObjectId, ref: 'Baker' },
  status: {
    type: String,
    enum: [
      'offered',
      'requested',
      'donor_assigned',
      'recipient_assigned',
      'completed',
      'closed'
    ],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SourdoughStarterDonation = mongoose.model(
  'SourdoughStarterDonation',
  donationSchema
);

export default SourdoughStarterDonation;