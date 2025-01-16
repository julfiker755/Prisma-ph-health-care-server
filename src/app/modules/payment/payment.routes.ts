import express, { NextFunction, Request, Response } from 'express'
import { paymentController } from './payment.controller'




const router = express.Router()


router.post("/init-payment/:appointmentId",paymentController.initPaymentBD)
router.get("/ipn",paymentController.validatePaymentBD)



export const paymentRoutes = router