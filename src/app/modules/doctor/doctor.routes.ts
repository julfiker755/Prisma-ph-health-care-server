import express, { NextFunction, Request, Response } from 'express'
import { DoctorController } from './doctor.controller'


// /doctor --root path

const router = express.Router()


router.get("/",DoctorController.getIntoBD)
router.patch("/:id",DoctorController.updateIntoBD)
// router.delete("/:id",specialtiesController.DeleteIntoDB)



export const DoctorRoutes = router