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
            objectToCreated.cartonsQuantity = cartonsQuantity
            //prepare galons data 
            let galonsArray = req.body.galons;
            let galons = [];
            let galonsQuantity = [];
            let galonsType = [];
            for (let z = 0; z < galonsArray.length; z++) {
                galons.push(galonsArray[z].id);
                galonsQuantity.push(galonsArray[z].quantity);
                galonsType.push(galonsArray[z].typeOrder)
            }
            objectToCreated.galons = galons;
            objectToCreated.galonsQuantity = galonsQuantity;
            objectToCreated.galonsTypeOrder = galonsType;
            //prepare location 
            let long = req.body.long;
            let lat = req.body.lat;
            let orderLocation = [long, lat];
            objectToCreated.location = orderLocation
            objectToCreated.provider = req.body.provider;
            objectToCreated.customer = req.user.id;
            objectToCreated.price = req.body.price;
            let newOrder = await Order.create(objectToCreated);
            //prepare response    
            let retriveOrder = await Order.findById(newOrder.id)
                .populate('cartons')
                .populate('galons')
                .populate('customer')
                .populate('provider')
            let lenOfCartons = await retriveOrder.cartons.length;
            let result = {};
            result.cartons = []
            //prepare cartons 
            let resultcartons = retriveOrder.cartons;
            let resultcartonsQuantity = retriveOrder.cartonsQuantity;
            for (let x = 0; x < lenOfCartons; x++) {
                let item = resultcartons[x];
                let quantityItem = resultcartonsQuantity[x];
                result.cartons.push({ "item": item, "quantity": quantityItem })
            }
            //prepare galons 
            let lenOfGalons = await retriveOrder.galons.length;
            result.galons = [];
            let resultGalons = retriveOrder.galons;
            let resultGalonsQuantity = retriveOrder.galonsQuantity;
            let resultGalonsTypeOrder = retriveOrder.galonsTypeOrder;
            for (let x = 0; x < lenOfGalons; x++) {
                let item = resultGalons[x];
                let quantityItem = resultGalonsQuantity[x];
                let type = resultGalonsTypeOrder[x];
                result.galons.push({ "item": item, "quantity": quantityItem, "typeOrder": type })
            }
            result.price = retriveOrder.price;
            result.location = retriveOrder.location;
            result.customer = retriveOrder.customer;
            result.provider = retriveOrder.provider;
            result.status = retriveOrder.status;
            result.creationDate = retriveOrder.creationDate;
            return res.status(200).json(result)
        } catch (err) {
            next(err)
        }




    },



}