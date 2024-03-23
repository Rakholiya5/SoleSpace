import { Router } from 'express';
import { validate } from '../utils/helper';
import { addFeedbackValidation, editFeedbackValidation } from '../validations/feedback';
import { addFeedback, editFeedback, removeFeedback } from '../controllers/feedback';
import { verifyUser } from '../middlewares/auth';

const feedbackRouter = Router();

feedbackRouter.use(verifyUser);

feedbackRouter.post('/add', validate(addFeedbackValidation), addFeedback);

feedbackRouter.put('/edit', validate(editFeedbackValidation), editFeedback);

feedbackRouter.delete('/remove/:id', removeFeedback);

export { feedbackRouter };
