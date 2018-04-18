import OrderController from '../controllers/order.controller';
import express from 'express';
import passport from 'passport';
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();

router.route('/users/:userId/orders')
    .post(
        requireAuth,
        OrderController.createOrder)
export default router;