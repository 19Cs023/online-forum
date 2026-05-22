import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    content: { type: String },
    picture : { type: String },
    topic: { type: String, required: true },
    isresolved: { type: Boolean, default: false },
    recorded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Question', questionSchema);