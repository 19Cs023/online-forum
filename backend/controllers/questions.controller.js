import express from 'express';
import Questions from '../models/questions.js';
import Users from '../models/user.js';
import mongoose from 'mongoose';
const { get } = mongoose;
import extend from 'lodash/extend.js'
import { catchAsync } from '../utils/catchAsync.js';
import { errorHandler } from '../middlewares/error.middleware.js';

// Create a new question
const create = catchAsync(async (req, res) => {
  try {
    req.body.recorded_by = req.auth._id
    const question = new Questions(req.body)
    await question.save()
    return res.status(200).json(question)
  } catch (err) {
    return errorHandler(err, req, res, next)
  }
})

const questionByID = catchAsync(async (req, res, next, id) => {
    try {
      let question = await Questions.findById(id).populate('recorded_by', '_id name').exec()
      if (!question)
        return res.status('400').json({
          error: "Question record not found"
        })
    } catch (err){
      return errorHandler(err, req, res, next)
    }
})

questionByanswerID = catchAsync(async (req, res, next, id) => {
    try {
      let question = await Questions.find({ answer_id: id }).populate('recorded_by', '_id name').exec()
        if (!question)
            return res.status('400').json({
                error: "Question record not found"
            })
    } catch (err){
        return errorHandler(err, req, res, next)
    }
})




const allquestions = catchAsync(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let questions = await Questions.find()
            .sort('-incurred_on')
            .skip(skip)
            .limit(limit)
            .populate('recorded_by', '_id name');

        const total = await Questions.countDocuments();

        return res.json({
            data: questions,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        return errorHandler(err, req, res)
    }
})

const listByUser = catchAsync(async (req, res) => {
  let firstDay = req.query.firstDay
  let lastDay = req.query.lastDay
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = { recorded_by: req.auth._id }
        if (firstDay && lastDay) {
            query.incurred_on = { $gte: firstDay, $lte: lastDay }
        }
        let questions = await Questions.find(query)
            .sort('-incurred_on')
            .skip(skip)
            .limit(limit)
            .populate('recorded_by', '_id name');
            
        const total = await Questions.countDocuments(query);

        return res.json({
            data: questions,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        return errorHandler(err, req, res)
    }
})

const update = catchAsync(async (req, res) => {
    try {
        let question = req.question
        question = extend(question, req.body)
        question.updated = Date.now()
        await question.save()
        res.json(question)
    } catch (err) {
        return errorHandler(err, req, res, next)
    }
})  

const remove = catchAsync(async (req, res) => {
    try {
        let question = req.question
        await question.remove()
        res.json({ message: 'Question deleted successfully' })
    } catch (err) {
        return errorHandler(err, req, res, next)
    }
})



export default { create, questionByID, read, allquestions, listByUser, update, remove }

