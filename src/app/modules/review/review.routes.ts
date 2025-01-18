import express from 'express'
import auth from '../../middlewares/auth'
import { userRole } from '@prisma/client'
import { reviewController } from './review.controller'

const router = express.Router()


router.post("/",auth(userRole.PATIENT),reviewController.reviewInsertBD)



export const reviewRoutes = router

