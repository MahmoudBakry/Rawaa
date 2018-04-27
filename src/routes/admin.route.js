import AdminController from '../controllers/admin.controller';
import express from 'express';
import passport from 'passport';
const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

router.route('/users')
    .get(
    requireAuth,
    AdminController.allUsers)
router.route('/price-delivir-km')
    .post(requireAuth, AdminController.createPriceOfKilloMeter)
router.route('/price-delivir-km/:id')
    .put(requireAuth, AdminController.updatePriceOfKilloMeter)

export default router