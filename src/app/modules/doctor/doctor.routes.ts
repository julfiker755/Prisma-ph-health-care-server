import express, { NextFunction, Request, Response } from 'express'
import { DoctorController } from './doctor.controller'



const router = express.Router()


router.get("/",DoctorController.getIntoBD)
router.post("/create",DoctorController.createDoctorBD)
router.patch("/:id",DoctorController.updateIntoBD)
// router.delete("/:id",specialtiesController.DeleteIntoDB)



export const DoctorRoutes = router