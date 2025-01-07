import express from 'express'
import { scheduleController } from './schedule.controller'
import auth from '../../middlewares/auth'
import { userRole } from '@prisma/client'



const router = express.Router()


router.get("/",auth(userRole.DOCTOR),scheduleController.getAllFromDB)
router.post("/",auth(userRole.ADMIN,userRole.SUPER_ADMIN),scheduleController.insertIntoDB)

export const scheduleRoutes = router

