import OrderController from '../controllers/order.controller';
import express from 'express';
import passport from 'passport';
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();

router.route('/users/:userId/orders')
    .post(
    requireAuth,
    OrderController.validateBody(),
    OrderController.createOrder)

router.route('/providers/:providerId/orders')
    .get(requireAuth,
    OrderController.allOrdersOfProvider)
//retrive one order details
router.route('/orders/:orderId')
    .get(requireAuth,
    OrderController.orderDetails)

//get distance between 2 point locations
router.route('/orders/pric-distance')
    .post(
    requireAuth,
    OrderController.validateBodyOfCalulatePrice(),
    OrderController.calculatePriceOfDistance)
export default router;