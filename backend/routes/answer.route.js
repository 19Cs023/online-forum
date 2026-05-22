import  express from 'express';
import answerCtrl from '../controllers/answer.controller.js';
import authCtrl from '../controllers/auth.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.route('/api/answers')
  .get(answerCtrl.allanswers)
  .post(authCtrl.requireSignin, upload.single('image'), answerCtrl.create);

router.route('/api/answers/suggestions')
  .get(answerCtrl.suggestions);

router.route('/api/answers/:answerId')
  .get(answerCtrl.read)
  .put(authCtrl.requireSignin, upload.single('image'), answerCtrl.update)
  .delete(authCtrl.requireSignin, upload.single('image'), answerCtrl.remove);

router.param('answerId', answerCtrl.answerByID);

export default router;
