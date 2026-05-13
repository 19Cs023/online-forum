import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    picture : { type: String },
    topic: { type: String, required: true },
    isresolved: { type: Boolean, default: false },
    answer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Question', questionSchema);