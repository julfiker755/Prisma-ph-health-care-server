import express, {Request, Response } from 'express'
import { userController } from './user.controller'
import auth from '../../middlewares/auth'
import { userRole } from '@prisma/client'
import { fileUploader } from '../../../helpers/fileUploader'
import { userValidation } from './user.validation'
const router = express.Router()





 


router.post("/",auth(userRole.SUPER_ADMIN,userRole.ADMIN),
fileUploader.upload.single("file"),
 (req:Request,res:Response)=>{
    req.body=userValidation.creatAdmin.parse(JSON.parse(req.body.data))
    return userController.createAdmin(req,res)
 }
)


export const userRoutes = router 