import express, { NextFunction, Request, Response } from 'express'
import { fileUploader } from '../../../helpers/fileUploader'
import { userValidation } from '../user/user.validation'
import { patientController } from './patient.controller'



const router = express.Router()


router.get("/",patientController.getIntoBD)
router.get("/:id",patientController.getSingleBD)

router.post("/create",
fileUploader.upload.single("file"),
 (req:Request,res:Response,next:NextFunction)=>{
    req.body=userValidation.createPatient.parse(JSON.parse(req.body.data))
    return patientController.createPatient(req,res,next)
 }
)

router.patch("/:id",patientController.updateIntoBD)
// router.delete("/:id",DoctorController.doctorDeleteBD)



export const patientRoutes = router