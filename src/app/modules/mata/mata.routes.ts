import express, { NextFunction, Request, Response } from 'express'
import { mataController } from './mata.controller'
import auth from '../../middlewares/auth'
import { userRole } from '@prisma/client'





const router = express.Router()


router.get('/',auth(userRole.SUPER_ADMIN,userRole.ADMIN,userRole.DOCTOR,userRole.PATIENT),mataController.fatchDashboardMetaData)


export const mataRoutes = router