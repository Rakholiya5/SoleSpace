import { Router } from 'express';
import {
    addShoe,
    addShoeDetails,
    deleteShoe,
    deleteShoeDetails,
    deleteShoeImages,
    featureShoe,
    getAdminShoe,
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
    getShoesValidation,
    updateShoeDetailsValidation,
    updateShoeValidation,
} from '../validations/shoes';
import { upload } from '../services/multer';

const uploadShoesImages = upload.array('images');

const shoesRouter = Router();

shoesRouter.post('/add', validate(addShoeValidation), addShoe);

shoesRouter.get('/', validate(getShoesValidation), getShoes);

shoesRouter.get('/:id', validate(getShoeValidation), getAdminShoe);

shoesRouter.put('/update/:id', validate(updateShoeValidation), updateShoe);

shoesRouter.delete('/delete/:id', validate(deleteShoeValidation), deleteShoe);

shoesRouter.post('/addDetails/:id', uploadShoesImages, validate(addShoeDetailsValidation), addShoeDetails);

shoesRouter.put('/updateDetails/:id/:detailsId', uploadShoesImages, validate(updateShoeDetailsValidation), updateShoeDetails);

shoesRouter.delete('/deleteDetails/:id/:detailsId', validate(deleteShoeDetailsValidation), deleteShoeDetails);

shoesRouter.delete('/shoesImages/:id/:detailsId', validate(deleteShoeImagesValidation), deleteShoeImages);

shoesRouter.get('/featureShoe/:id', featureShoe);

export default shoesRouter;
