import express from 'express';
import questionsCtrl from '../controllers/questions.controller.js';
import authCtrl from '../controllers/auth.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.route('/api/questions')
  .get(questionsCtrl.allquestions)
  .post(authCtrl.requireSignin, upload.single('image'), questionsCtrl.create);

router.route('/api/questions/search')
  .get(questionsCtrl.search);

router.route('/api/questions/user')
  .get(authCtrl.requireSignin, questionsCtrl.listByUser);

router.route('/api/questions/:questionId')
  .get(questionsCtrl.read)
  .put(questionsCtrl.update)
  .delete(questionsCtrl.remove);

router.param('questionId', questionsCtrl.questionByID);
router.param('answerId', questionsCtrl.questionByanswerID);

export default router;