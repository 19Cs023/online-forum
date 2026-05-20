import express from 'express';
import commentsCtrl from '../controllers/comments.controller.js';
import authCtrl from '../controllers/auth.controller.js';

const router = express.Router();

router.route('/api/comments')
  .get(commentsCtrl.allcomments)
  .post(authCtrl.requireSignin, commentsCtrl.create);

router.route('/api/comments/user')
  .get(authCtrl.requireSignin, commentsCtrl.listByUser);

router.route('/api/comments/question/:questionId')
  .get(commentsCtrl.commentByquestionID)
  .post(authCtrl.requireSignin, commentsCtrl.createForQuestion);

router.route('/api/comments/answer/:answerId')
  .get(commentsCtrl.commentByanswerID)
  .post(authCtrl.requireSignin, commentsCtrl.createForAnswer);

router.route('/api/comments/:commentId')
  .get(commentsCtrl.read)
  .put(commentsCtrl.update);

router.param('commentId', commentsCtrl.commentByID);

export default router;
