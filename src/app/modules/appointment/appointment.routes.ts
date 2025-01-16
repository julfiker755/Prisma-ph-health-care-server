import express from 'express'
import { AppointmentController } from './appointment.controller'
import auth from '../../middlewares/auth'
import { userRole } from '@prisma/client'

const router = express.Router()


router.post("/", auth(userRole.PATIENT),AppointmentController.createAppoinment)
router.get("/my-appointment",auth(userRole.PATIENT,userRole.DOCTOR),AppointmentController.MyAppoinment)



export const AppoinmentRoutes = router