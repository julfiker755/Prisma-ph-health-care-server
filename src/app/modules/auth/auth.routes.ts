import express from 'express'
import { AuthController } from './auth.controller'
import auth from '../../middlewares/auth'
import { userRole } from '@prisma/client'
const router = express.Router()

router.post("/login", AuthController.loginUser)
router.post("/refresh-token", AuthController.refreshToken)
router.post("/change-password", auth(userRole.SUPER_ADMIN, userRole.ADMIN, userRole.DOCTOR, userRole.DOCTOR), AuthController.changePassword)
router.post("/forgot-password", AuthController.forgotPassword)
router.post("/reset-password", AuthController.resetPassword)

export const AuthRoutes = router