import Order from '../models/order.model'
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import ApiError from '../helpers/ApiError'
import ApiResponse from '../helpers/ApiResponse'

export default {
    //create new order 
    async createOrder(req, res, next) {
        try {
            let objectToCreated = {}
            //prepare carton data [[{id : 5, quantity : 8}]]  
            let cartonsArray = req.body.cartons;
            let cartons = [];
            let cartonsQuantity = [];
            for (let x = 0; x < cartonsArray.length; x++) {
                cartons.push(cartonsArray[x].id);
                cartonsQuantity.push(cartonsArray[x].quantity);
            }
            objectToCreated.cartons = cartons;
            objectToCreated.cartonsQuantity =cartonsQuantity
            return res.status(200).json(objectToCreated) 

        } catch (err) {
            next(err)
        }




    },



}