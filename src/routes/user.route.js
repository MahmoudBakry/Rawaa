import UserController from '../controllers/user.controller'
import galonController from '../controllers/galon/galon.controller'
import cartonController from '../controllers/cartona/cartona.controller'
import express from 'express';
import passport from "passport";
import passportService from '../services/passport';
import { multerSaveTo } from '../services/multer'
const requireSignIn = passport.authenticate('local', { session: false });
const router = express.Router();

router.route('/signup')
    .post(
        multerSaveTo('users').single('img'),
        UserController.validateBody(),
        UserController.signUp
    )

router.post("/signin", requireSignIn, UserController.signin);

router.route("/users/:userId/galons")
    .get(galonController.galonsOfOneProvider)

router.route("/users/:userId/cartons")
    .get(cartonController.cartonsOfOneProvider)
export default router;


