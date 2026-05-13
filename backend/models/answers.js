import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    tittle: { type: String, required: true },
    Picture: { type: String },
    topic: { type: String, required: true },
    content : { type: String, required: true },
    question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    Comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

export default mongoose.model('Answer', answerSchema);