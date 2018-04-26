import Order from '../models/order.model'
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import ApiError from '../helpers/ApiError'
import ApiResponse from '../helpers/ApiResponse'

export default {

    validateBody(isUpdate = false) {
        return [
            body("price").exists().withMessage("price is required"),
            body("provider").exists().withMessage("provider is required"),
        ];
    },
    //create new order 
    async createOrder(req, res, next) {
        try {
            const validationErrors = validationResult(req).array();
            if (validationErrors.length > 0)
                return next(new ApiError(422, validationErrors));
            let objectToCreated = {}
            //prepare carton data [[{id : 5, quantity : 8}]]
            if (req.body.cartons) {
                let cartonsArray = req.body.cartons;
                let cartons = [];
                let cartonsQuantity = [];
                for (let x = 0; x < cartonsArray.length; x++) {
                    cartons.push(cartonsArray[x].id);
                    cartonsQuantity.push(cartonsArray[x].quantity);
                }
                objectToCreated.cartons = cartons;
                objectToCreated.cartonsQuantity = cartonsQuantity
            }

            //prepare galons data 
            if (req.body.galons) {
                let galonsArray = req.body.galons;
                let galons = [];
                let galonsQuantityOfBuying = [];
                let galonsQuantityOfSubstitution = [];
                let galonsType = [];
                for (let z = 0; z < galonsArray.length; z++) {
                    galons.push(galonsArray[z].id);
                    galonsQuantityOfBuying.push(galonsArray[z].quantityOfBuying);
                    galonsQuantityOfSubstitution.push(galonsArray[z].quantityOfSubstitution);
                    galonsType.push(galonsArray[z].typeOrder)
                }
                objectToCreated.galons = galons;
                objectToCreated.galonsQuantityOfBuying = galonsQuantityOfBuying;
                objectToCreated.galonsQuantityOfSubstitution = galonsQuantityOfSubstitution;
            }
            //prepare location 
            let lang = req.body.lang;
            let lat = req.body.lat;
            let orderLocation = [lang, lat];
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
            let resultGalonsQuantityOfBuying = retriveOrder.galonsQuantityOfBuying;
            let resultGalonsQuantityOfSubstitution = retriveOrder.galonsQuantityOfSubstitution;
            let resultGalonsTypeOrder = retriveOrder.galonsTypeOrder;
            for (let x = 0; x < lenOfGalons; x++) {
                let item = resultGalons[x];
                let quantityOfBuying = resultGalonsQuantityOfBuying[x];
                let quantityOfSubstitution = resultGalonsQuantityOfSubstitution[x];
                result.galons.push({
                    "item": item,
                    "quantityOfBuying": quantityOfBuying,
                    "typeOrderOfSubstitution": quantityOfSubstitution
                })
            }
            result.price = retriveOrder.price;
            result.location = retriveOrder.location;
            result.customer = retriveOrder.customer;
            result.provider = retriveOrder.provider;
            result.status = retriveOrder.status;
            result.creationDate = retriveOrder.creationDate;
            result.id = retriveOrder.id
            return res.status(201).json(result)
        } catch (err) {
            next(err)
        }

    },
    //retrive all orders under specific provider 
    async allOrdersOfProvider(req, res, next) {
        try {
            let limit = req.query.limit || 20;
            let page = req.query.page || 1;
            let query = {}
            if (req.query.status)
                query.status = req.query.status;
            query.provider = req.params.providerId;
            let allOrders = await Order.find(query)
                .populate('cartons')
                .populate('galons')
                .populate('customer')
                .populate('provider')
                .skip((page - 1) * limit).limit(limit)
                .sort({ creationDate: -1 });
            //prepare response 
            let result = allOrders.map(elme => {
                //first prepare cartons
                let OneOrderItem = {};
                let cartonsResult = [];
                let cartons = elme.cartons;
                let cartonsQuantity = elme.cartonsQuantity;
                for (let x = 0; x < cartons.length; x++) {
                    let oneCartonItem = {};
                    let item = cartons[x];
                    let quantity = cartonsQuantity[x]
                    oneCartonItem.item = item;
                    oneCartonItem.quantity = quantity;
                    cartonsResult.push(oneCartonItem);
                }
                //assign cartons result to order item 
                OneOrderItem.cartons = cartonsResult;
                //prepare galons    
                let galonsResult = [];
                let galons = elme.galons;
                let galonsQuantityOfBuying = elme.galonsQuantityOfBuying;
                let galonsQuantityOfSubstitution = elme.galonsQuantityOfSubstitution;
                for (let x = 0; x < galons.length; x++) {
                    let oneGalonsItem = {};
                    let item = galons[x];
                    let QuantityOfBuying = galonsQuantityOfBuying[x]
                    let QuantityOfSubstitution = galonsQuantityOfSubstitution[x]
                    oneGalonsItem.item = item;
                    oneGalonsItem.galonsQuantityOfBuying = QuantityOfBuying;
                    oneGalonsItem.galonsQuantityOfSubstitution = QuantityOfSubstitution;
                    galonsResult.push(oneGalonsItem);
                }
                //assign galons result to order item 
                OneOrderItem.galons = galonsResult;
                OneOrderItem.location = elme.location;
                OneOrderItem.customer = elme.customer;
                OneOrderItem.provider = elme.provider;
                OneOrderItem.status = elme.status;
                OneOrderItem.creationDate = elme.creationDate;
                OneOrderItem.id = elme.id;
                return OneOrderItem;
            })



            return res.status(200).json(result)
        } catch (err) {
            next(err)
        }
    }



}