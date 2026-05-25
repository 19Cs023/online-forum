import express from 'express';
import Answers from '../models/answers.js';
import Users from '../models/user.js';
import Question from '../models/questions.js';
import mongoose from 'mongoose';
import { get } from 'mongoose';
import extend from 'lodash/extend.js'
import { catchAsync } from '../utils/catchAsync.js';
import { errorHandler } from '../middlewares/error.middleware.js';

// Create a new answer
const create = catchAsync(async (req, res) => {
  try {
    req.body.recorded_by = req.auth._id
    const answer = new Answers(req.body)
    const image = req.file ? req.file.path : null;
    if (image) {
      answer.image = image;
    }
    await answer.save()
    return res.status(200).json(answer)
  } catch (err) {
    return errorHandler(err, req, res, next)
  }
})

const answerByID = async (req, res, next, id) => {
    try {
        const answer = await Answers.findById(id).populate('recorded_by', '_id name').exec()
        if (!answer)
            return res.status(400).json({
                error: "Answer record not found"
            })
        req.answer = answer
        next()
    } catch (err){
        return res.status(400).json({ error: "Could not retrieve answer record" })
    }
}

const read = catchAsync(async (req, res, next) => {
    try {
        let answer = await Answers.findById(req.params.answerId).populate('recorded_by', '_id name').exec();
        if (!answer)
            return res.status(400).json({
                error: "Answer record not found"
            });
        return res.status(200).json(answer);
    } catch (err){
        return errorHandler(err, req, res, next)
    }
});

const allanswers = catchAsync(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        let answers = await Answers.find()
            .sort('-incurred_on')
            .skip(skip)
            .limit(limit)
            .populate('recorded_by', '_id name');
        return res.status(200).json(answers)
    } catch (err) {
        return errorHandler(err, req, res, next)
    }
})

const listByUser = catchAsync(async (req, res) => {
    try {
        let answers = await Answers.find({ recorded_by: req.auth._id })
            .populate('recorded_by', '_id name')
            .exec()
        return res.status(200).json(answers)
    } catch (err) {
        return errorHandler(err, req, res, next)
    }   
})

const update = catchAsync(async (req, res) => {
    try {
        let answer = req.answer
        answer = extend(answer, req.body)
        const image = req.file ? req.file.path : null;
        if (image) {
          answer.image = image;
        }
        await answer.save()
        return res.status(200).json(answer)
    } catch (err) {
        return errorHandler(err, req, res, next)
    }
})

const remove = catchAsync(async (req, res) => {
    try {
        let answer = req.answer
        await answer.deleteOne()
        return res.status(200).json({ message: "Answer deleted successfully" })
    } catch (err) {
        return errorHandler(err, req, res, next)
    }
}) 

const answerByquestionID = catchAsync(async (req, res, next, id) => {
    try {
        let answer = await Answers.find({ question_id: id }).populate('recorded_by', '_id name').exec()
        if (!answer)
            return res.status(400).json({
                error: "Answer record not found"
            })
    } catch (err){
        return errorHandler(err, req, res, next)
    }
})

const suggestions = catchAsync(async (req, res, next) => {
    try {
        const topAnswers = await Answers.find()
            .sort({ likes: -1 })
            .limit(5)
            .populate('question_id', 'question') // get question title
            .exec();
        return res.status(200).json(topAnswers);
    } catch (err) {
        return errorHandler(err, req, res, next);
    }
});

export default {
    create,
    answerByID,
    read,
    allanswers,
    listByUser,
    update,
    remove,
    answerByquestionID,
    suggestions
}
