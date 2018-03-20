import Galon from '../../models/galon.model';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator/check';
import { toImgUrl } from '../../utils/index'
import ApiError from '../../helpers/ApiError'
import ApiResponse from '../../helpers/ApiResponse'


export default {

    validateBody(isUpdate = false) {
        return [
            body("size").exists().withMessage("numberOfBottles is required"),
            body("price").exists().withMessage("sizeOfBottles is required")
        ];
    },
    //create new galon
    async createGalon(req, res, next) {
        const validationErrors = validationResult(req).array();
        if (validationErrors.length > 0)
            return next(new ApiError(422, validationErrors));
        try {
            if (!(req.user.type == "PROVIDER")) {
                next(new ApiError(403, 'not provider user'))
            }
            if (req.file) {
                req.body.img = await toImgUrl(req.file)
            } else {
                next(new ApiError(422, 'img is required'))
            }
            req.body.user = req.user._id
            let newDoc = await Galon.create(req.body);
            return res.status(201).json(newDoc);
        } catch (err) {
            next(err)
        }
    },

    //retrive all galons 
    async allGalons(req, res, next) {
        const limit = parseInt(req.query.limit) || 20;
        const page = req.query.page || 1;
        let query = {}
        try {
            let docsCount = await Galon.count(query)
            let allDocs = await Galon.find(query).populate('user')
                .skip((page * limit) - limit).limit(limit).sort({ creationDate: -1 });
            return res.send(new ApiResponse(
                allDocs,
                page,
                Math.ceil(docsCount / limit),
                limit,
                docsCount,
                req
            ))
        } catch (err) {
            next(err)
        }
    },

    //retrive 
}