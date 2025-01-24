import express from 'express'
import { scheduleController } from './schedule.controller'
import auth from '../../middlewares/auth'
import { userRole } from '@prisma/client'



const router = express.Router()


router.get("/",auth(userRole.DOCTOR,userRole.ADMIN),scheduleController.getAllFromDB)
router.get("/:id",auth(userRole.DOCTOR),scheduleController.getIntoDB)
router.delete("/:id",auth(userRole.DOCTOR),scheduleController.deleteIntoDB)
router.post("/", auth(userRole.ADMIN,userRole.SUPER_ADMIN),scheduleController.insertIntoDB)

export const scheduleRoutes = router

