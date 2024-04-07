import { Router } from 'express';
import { verifyAdmin } from '../middlewares/auth';
import { validate } from '../utils/helper';
import { contactUsValidation, getContactUsValidation } from '../validations/contactUs';
import { contactUs, getContactUs } from '../controllers/contactUs';

const contactUsRouter = Router();

contactUsRouter.post('/add', validate(contactUsValidation), contactUs);

contactUsRouter.get('/', verifyAdmin, validate(getContactUsValidation), getContactUs);

export { contactUsRouter };
