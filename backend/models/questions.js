import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    content: { type: String },
    picture : { type: String },
    topic: { type: String, required: true },
    bookmarked_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks_count: { type: Number, default: 0 },
    bookmarked: { type: Boolean, default: false },
    isresolved: { type: Boolean, default: false },
    recorded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Question', questionSchema);