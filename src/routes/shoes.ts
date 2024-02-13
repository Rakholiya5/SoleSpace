import { Router } from 'express';
import {
    addShoe,
    addShoeDetails,
    deleteShoe,
    deleteShoeDetails,
    deleteShoeImages,
    getShoe,
    getShoes,
    updateShoe,
    updateShoeDetails,
} from '../controllers/shoes';
import { validate } from '../utils/helper';
import {
    addShoeDetailsValidation,
    addShoeValidation,
    deleteShoeDetailsValidation,
    deleteShoeImagesValidation,
    deleteShoeValidation,
    getShoeValidation,
    updateShoeDetailsValidation,
    updateShoeValidation,
} from '../validations/shoes';

import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({ storage });

const uploadShoesImages = upload.array('images');

const shoesRouter = Router();

shoesRouter.post('/add', validate(addShoeValidation), addShoe);

shoesRouter.get('/', getShoes);

shoesRouter.get('/:id', validate(getShoeValidation), getShoe);

shoesRouter.put('/update/:id', validate(updateShoeValidation), updateShoe);

shoesRouter.delete('/delete/:id', validate(deleteShoeValidation), deleteShoe);

shoesRouter.post('/addDetails/:id', uploadShoesImages, validate(addShoeDetailsValidation), addShoeDetails);

shoesRouter.put('/updateDetails/:id/:detailsId', uploadShoesImages, validate(updateShoeDetailsValidation), updateShoeDetails);

shoesRouter.delete('/deleteDetails/:id/:detailsId', validate(deleteShoeDetailsValidation), deleteShoeDetails);

shoesRouter.delete('/shoesImages/:id/:detailsId', validate(deleteShoeImagesValidation), deleteShoeImages);

export default shoesRouter;
