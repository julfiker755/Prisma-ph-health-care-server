import express, { NextFunction, Request, Response } from 'express'
import { DoctorController } from './doctor.controller'
import auth from '../../middlewares/auth'
import { userRole } from '@prisma/client'
import { fileUploader } from '../../../helpers/fileUploader'



const router = express.Router()


router.get("/",DoctorController.getIntoBD)

router.post("/create",
auth(userRole.ADMIN,userRole.SUPER_ADMIN),
fileUploader.upload.single("file"),
 (req:Request,res:Response,next:NextFunction)=>{
    req.body=JSON.parse(req.body.data)
    return DoctorController.createDoctorBD(req,res,next)
 })

router.patch("/:id",DoctorController.updateIntoBD)
router.delete("/:id",DoctorController.doctorDeleteBD)



export const DoctorRoutes = router