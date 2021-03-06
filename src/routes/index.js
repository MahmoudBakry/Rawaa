import userRoutes from './user.route';
import express from 'express';
import passport from "passport";
import galonRoutes from './galon/galon.route'
import cartonaRoutes from './cartona/cartona.route';
import orderRoutes from './order.route'
import adminRoutes from './admin.route'
import providerRoutes from './providers.route'
const requireAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();


router.use('/', userRoutes);
router.use('/cartons', requireAuth, cartonaRoutes)
router.use('/galons', requireAuth, galonRoutes)
router.use('/', orderRoutes)
router.use('/admin', adminRoutes)
router.use('/providers', providerRoutes)
export default router;