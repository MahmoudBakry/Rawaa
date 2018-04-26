import User from '../models/user.model'
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import ApiError from '../helpers/ApiError'
import ApiResponse from '../helpers/ApiResponse'
//KfQnPp9bNf2S2m6z
export default {
    //create new order 
    async allUsers(req, res, next) {
        try {
            if (req.user.type != "ADMIN")
                return next(new ApiError(403, "not admin user"));

            let query = {}
            if (req.query.type) {
                query.type = req.query.type;
            }
            let users = await User.find(query).sort({ creationDate: -1 });
            return res.status(200).json(users)
        } catch (err) {
            next(err)
        }
    },



}