import express, {NextFunction, Request, Response } from 'express'
import { userController } from './user.controller'
import auth from '../../middlewares/auth'
import { userRole } from '@prisma/client'
import { fileUploader } from '../../../helpers/fileUploader'
import { userValidation } from './user.validation'
const router = express.Router()





router.post("/create-admim",auth(userRole.SUPER_ADMIN,userRole.ADMIN),
fileUploader.upload.single("file"),
 (req:Request,res:Response,next:NextFunction)=>{
    req.body=userValidation.creatAdmin.parse(JSON.parse(req.body.data))
    return userController.createAdmin(req,res,next)
 }
)


router.post("/create-doctor",auth(userRole.SUPER_ADMIN,userRole.ADMIN),
fileUploader.upload.single("file"),
 (req:Request,res:Response,next:NextFunction)=>{
    req.body=userValidation.createDoctor.parse(JSON.parse(req.body.data))
    return userController.createDoctor(req,res,next)
 }
)


router.post("/create-patient",
fileUploader.upload.single("file"),
 (req:Request,res:Response,next:NextFunction)=>{
    req.body=userValidation.createPatient.parse(JSON.parse(req.body.data))
    return userController.createPatient(req,res,next)
 }
)


export const userRoutes = router 