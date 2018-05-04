import User from '../models/user.model'
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import ApiError from '../helpers/ApiError'
import ApiResponse from '../helpers/ApiResponse'
import PriceKm from '../models/price-of-km.model';
import Order from '../models/order.model'

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
    //create price for km in diliver
    async createPriceOfKilloMeter(req, res, next) {
        try {
            if (!(req.user.type == "ADMIN"))
                return next(new ApiError(403, "not admin user"));
            if (!req.body.price)
                return next(new ApiError(422, "price is required"))
            let prices = await PriceKm.find();
            if (prices.length > 0)
                return next(new ApiError(400, "price already exist, update it plz"))
            let newDoc = await PriceKm.create(req.body);
            return res.status(201).json(newDoc);
        } catch (err) {
            next(err)
        }
    },

    //update price for km in diliver
    async updatePriceOfKilloMeter(req, res, next) {
        try {
            if (!(req.user.type == "ADMIN"))
                return next(new ApiError(403, "not admin user"));
            if (!req.body.price)
                return next(new ApiError(422, "price is required"))
            let price = await PriceKm.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            )
            return res.status(200).json(price)
        } catch (err) {
            next(err)
        }
    },
    //deactive user account
    async deactiveUser(req, res, next) {
        try {
            if (!(req.user.type == "ADMIN"))
                return next(new ApiError(403, "not admin user"));
            let userId = req.params.userId;
            let userDetails = await User.findById(userId);
            if (!userDetails)
                return next(new ApiError(404));
            let newUser = await User.findByIdAndUpdate(userId, { active: false }, { new: true });
            return res.status(200).json(newUser);
        } catch (err) {
            next(err)
        }
    },
    //active user account 
    async activeUser(req, res, next) {
        try {
            if (!(req.user.type == "ADMIN"))
                return next(new ApiError(403, "not admin user"));
            let userId = req.params.userId;
            let userDetails = await User.findById(userId);
            if (!userDetails)
                return next(new ApiError(404));
            let newUser = await User.findByIdAndUpdate(userId, { active: true }, { new: true });
            return res.status(200).json(newUser);
        } catch (err) {
            next(err)
        }
    },
    async adminStatisttics(req, res, next) {
        let numberOfOrder = await Order.count();
        let penddingOrder = await Order.count({ status: "pendding" });
        let acceptedOrder = await Order.count({ status: "accepted" });
        let rejectedOrder = await Order.count({ status: "rejected" });
        let onTheWayOrder = await Order.count({ status: "onTheWay" });
        let deliveredOrder = await Order.count({ status: "delivered" });
        let numberOfClient = await User.count({ type: "NORMAL" });
        let numberOfProvider = await User.count({ type: "PROVIDER" });
        return res.status(200).json({
            numberOfOrder,
            penddingOrder,
            acceptedOrder,
            rejectedOrder,
            onTheWayOrder,
            deliveredOrder,
            numberOfClient,
            numberOfProvider
        })
    },

}