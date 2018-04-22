import AdminController from '../controllers/admin.controller';
import express from 'express';
import passport from 'passport';
const router = express.Router();
const requireAuth = passport.authenticate('jwt', { session: false });

router.route('/users')
    .get(
        requireAuth,
        AdminController.allUsers)

export default router