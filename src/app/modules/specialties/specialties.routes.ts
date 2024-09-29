import express, { NextFunction, Request, Response } from 'express'
import { specialtiesController } from './specialties.controller'
import { fileUploader } from '../../../helpers/fileUploader'
import { specialtiesValidation } from './specialties.validation'
import auth from '../../middlewares/auth'
import { userRole } from '@prisma/client'


const router = express.Router()


router.get("/all",specialtiesController.getIntoDB)
router.delete("/:id",specialtiesController.DeleteIntoDB)

router.post("/",
   // auth(userRole.SUPER_ADMIN,userRole.ADMIN,userRole.DOCTOR),
    fileUploader.upload.single("file"),
 (req:Request,res:Response,next:NextFunction)=>{
    req.body=specialtiesValidation.specialtiesShema.parse(JSON.parse(req.body.data))
    return specialtiesController.insertIntoDB(req,res,next)
 })

export const SpecialtiesRoutes = router