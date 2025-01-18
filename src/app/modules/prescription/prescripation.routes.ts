import express from 'express'
import auth from '../../middlewares/auth'
import { userRole } from '@prisma/client'
import { prescriptionController } from './prescription.controller'



const router = express.Router()


router.get("/my-prescription",auth(userRole.PATIENT),prescriptionController.myPrescriptionInsertBD)
router.post("/",auth(userRole.DOCTOR),prescriptionController.prescriptionInsertBD)

export const prescriptionRoutes = router

