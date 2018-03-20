import GalonController from '../../controllers/galon/galon.controller'
import express from 'express';
import { multerSaveTo } from '../../services/multer';
import cartonaController from '../../controllers/cartona/cartona.controller';
const router = express.Router();

router.route('/')
    .post(
        multerSaveTo('galons').single('img'),
        GalonController.validateBody(),
        GalonController.createGalon
    )
    .get(GalonController.allGalons)

export default router;