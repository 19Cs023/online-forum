import  express from 'express';
import answerCtrl from '../controllers/answer.controller.js';
import authCtrl from '../controllers/auth.controller.js';

const router = express.Router();

router.route('/api/answers')
  .get(answerCtrl.allanswers)
  .post(authCtrl.requireSignin, answerCtrl.create);

router.route('/api/answers/:answerId')
  .get(answerCtrl.read)
  .put(authCtrl.requireSignin, answerCtrl.update)
  .delete(authCtrl.requireSignin, answerCtrl.remove);

router.param('answerId', answerCtrl.answerByID);

export default router;
