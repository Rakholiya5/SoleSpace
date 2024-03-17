import { Router } from 'express';
import { verifyAdmin } from '../middlewares/auth';
import { addCategory, deleteCategory, deleteCategoryImage, getCategories, getCategory, updateCategory } from '../controllers/category';
import { validate } from '../utils/helper';
import { addCategoryValidation, updateCategoryValidation } from '../validations/category';
import { upload } from '../services/multer';

const adminCategoryRouter = Router();

adminCategoryRouter.use(verifyAdmin);

adminCategoryRouter.post('/add', upload.single('image'), validate(addCategoryValidation), addCategory);

adminCategoryRouter.get('/', getCategories);

adminCategoryRouter.put('/update', upload.single('image'), validate(updateCategoryValidation), updateCategory);

adminCategoryRouter.get('/:id', getCategory);

adminCategoryRouter.delete('/delete/:id', deleteCategory);

adminCategoryRouter.delete('/delete-image/:id', deleteCategoryImage);

export { adminCategoryRouter };
