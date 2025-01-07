import express from 'express'
import auth from '../../middlewares/auth'
import { userRole } from '@prisma/client'
import { doctorScheduleController } from './doctorSchedule.controller'



const router = express.Router()


router.get("/",auth(userRole.DOCTOR),doctorScheduleController.getIntoDB)
router.post("/",auth(userRole.DOCTOR), doctorScheduleController.insertIntoDB)
router.delete("/:id",auth(userRole.DOCTOR), doctorScheduleController.deleteFormDB)

export const doctorScheduleRoutes = router