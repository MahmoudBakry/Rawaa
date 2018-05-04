import AdminController from '../controllers/admin.controller';
import express from 'express';
import passport from 'passport';
const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

router.route('/users')
    .get(
    requireAuth,
    AdminController.allUsers)
router.route('/counts-numbers')
    .get(AdminController.adminStatisttics)
router.route('/price-delivir-km')
    .post(requireAuth, AdminController.createPriceOfKilloMeter)
router.route('/price-delivir-km/:id')
    .put(requireAuth, AdminController.updatePriceOfKilloMeter)
router.route('/users/:userId/de-active')
    .put(requireAuth, AdminController.deactiveUser)
router.route('/users/:userId/active')
    .put(requireAuth, AdminController.activeUser)

export default router