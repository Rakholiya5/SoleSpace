import { Router } from 'express';
import { validate } from '../utils/helper';
import { addFeedbackValidation, editFeedbackValidation } from '../validations/feedback';
import { addFeedback, editFeedback, removeFeedback } from '../controllers/feedback';
import { verifyUser } from '../middlewares/auth';
import { upload } from '../services/multer';

const feedbackRouter = Router();

feedbackRouter.use(verifyUser);

feedbackRouter.post('/add', upload.single('image'), validate(addFeedbackValidation), addFeedback);

feedbackRouter.put('/edit', upload.single('image'), validate(editFeedbackValidation), editFeedback);

feedbackRouter.delete('/remove/:id', removeFeedback);

export { feedbackRouter };
